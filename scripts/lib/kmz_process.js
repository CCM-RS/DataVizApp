/**
 * @file
 * Updates local copy of KMZ geo data from Sigmine, then parses and converts it.
 *
 * See https://www.gov.br/anm/pt-br/assuntos/acesso-a-sistemas/sistema-de-informacoes-geograficas-da-mineracao-sigmine
 */

const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const { pipeline } = require('stream');
const tj = require('@mapbox/togeojson');
const { DOMParser } = require('xmldom');
const extract = require('extract-zip');
const { write_file } = require('./fs.js');
const slugify = require('@sindresorhus/slugify');

// Settings.
const rsKmzFileSource = 'http://sigmine.dnpm.gov.br/sirgas2000/RS.kmz';
const rsKmzFilePath = 'private/RS.kmz';
const kmzLocalCopyAgeLimit = 1000 * 60 * 60 * 24 * 31;
const rsRawGeoJsonFilePath = 'static/data/cache/raw_geo.json';
const debugCapItems = 10;

// Shared instance of the DOM parser.
const parser = new DOMParser({
	locator: {},
	errorHandler: {
		warning: w => {},
		error: e => {},
		fatalError: e => console.error(e)
	}
});

/**
 * Fetches KMZ source file for RS only if local file is older than 31 days.
 */
const fetchKmzFile = (fileSource, filePath, ageLimit) => {
	let requireDownload = false;
	let fileHasBeenUpdated = false;

	// Defaults.
	if (!fileSource) {
		fileSource = rsKmzFileSource;
	}
	if (!filePath) {
		filePath = rsKmzFilePath;
	}
	if (!ageLimit) {
		ageLimit = kmzLocalCopyAgeLimit;
	}

	if (!fs.existsSync(filePath)) {
		requireDownload = true;
	} else {
		fs.stat(filePath, (err, stat) => {
			if (err) {
				return console.error('Unable to stat local file ' + filePath, err);
			}

			const now = new Date().getTime();
			const lastModif = new Date(stat.mtime).getTime();

			if (now > ageLimit + lastModif) {
				requireDownload = true;
			} else {
				console.log(`No need to re-download '${filePath}' because it is less than 31 days old.`);
			}
		});
	}

	// Nothing to do here if download is not required -> exit early.
	if (!requireDownload) {
		return;
	}

	// Delete obsolete version (if it exists).
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}

	// Download the new, up to date version.
	// @see https://stackoverflow.com/a/60684836/2592338
	const fileWriteStream = fs.createWriteStream(filePath);
	http.get(rsKmzFileSource, response => {
		pipeline(response, fileWriteStream, err => {
			if (err) {
				console.error('Failed to download the KMZ file from SIGMINE.', err);
				fs.unlinkSync(filePath);
			} else {
				fileHasBeenUpdated = true;
				console.log('Successfully downloaded the KMZ file from SIGMINE.');
			}
		});
	});

	return fileHasBeenUpdated;
};

/**
 * Decompresses the KMZ source file.
 *
 * TODO [evol] use a dedicated sub-folder in case this code gets reused for
 * other states.
 */
const unzipKmzFile = async filePath => {
	// Delete any potentially obsolete local unzipped copies (if they exist).
	const filesToClean = ['private/doc.kml', 'private/legend0.png'];
	filesToClean.forEach(f => {
		if (fs.existsSync(f)) {
			fs.unlinkSync(f);
		}
	});

	// Defaults.
	if (!filePath) {
		filePath = rsKmzFilePath;
	}

	// Unzip KMZ to KML.
	try {
		await extract(filePath, { dir: path.resolve('private') });
		console.log('Successfully extracted the KMZ file.');
	} catch (err) {
		console.error('Failed to unzip the KMZ file.', err);
		return false;
	}

	// Clear the local copy of the "raw" GeoJson data if it exists.
	if (fs.existsSync(rsRawGeoJsonFilePath)) {
		fs.unlinkSync(rsRawGeoJsonFilePath);
	}

	return true;
};

/**
 * Transforms it to geoJson format.
 *
 * @returns {Object} the GeoJson data.
 */
const transformKmzFileToGeoJson = async () => {
	// Avoid re-converting if a local copy of the "raw" GeoJson data exists.
	if (fs.existsSync(rsRawGeoJsonFilePath)) {
		return fs.readJsonSync(rsRawGeoJsonFilePath);
	}

	// Automatically attempt to fetch the missing file.
	if (!fs.existsSync('private/doc.kml')) {
		if (fetchKmzFile()) {
			await unzipKmzFile();
		}
	}

	const kml = parser.parseFromString(fs.readFileSync('private/doc.kml', 'utf8'));
	if (!kml) {
		console.error('Failed to parse KML file.', err);
		return false;
	}

	const converted = tj.kml(kml);
	if (!converted || !('features' in converted)) {
		console.error('Failed to convert KML file to GeoJson.', err);
		return false;
	}

	// Debug : only keep a few random entries to test.
	if (debugCapItems) {
		for (i = converted.features.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[converted.features[i], converted.features[j]] = [converted.features[j], converted.features[i]];
		}
		converted.features.splice(0, converted.features.length - debugCapItems);
	}

	// Keep a local copy of the "raw" GeoJson data.
	await write_file(rsRawGeoJsonFilePath, JSON.stringify(converted));

	return converted;
};

/**
 * Extracts structured data from the GeoJson object.
 */
const extractGeoJsonData = async converted => {
	if (!converted) {
		converted = await transformKmzFileToGeoJson();
	}

	// Debug.
	// console.log(converted);

	let i;
	let j;
	const parsedProjects = [];
	const projectsByPhase = [];
	const projectsByMunicipality = [];

	// debug.
	// console.log(Object.keys(converted));

	// Filter features properties.
	const propertiesWhiteList = ['name', 'stroke', 'stroke-width', 'fill'];

	converted.features.forEach((feature, i) => {
		// Extract data from description property and store parsed project data.
		const project = parseGeoJsonDesc(feature);
		if (project) {
			parsedProjects.push(project);
		}

		// Sort by default on 'modified' key.
		parsedProjects.sort((a, b) => b.modified.localeCompare(a.modified));

		// Debug.
		console.log(project);

		// Prune non-geographical data for GeoJson cached storage.
		const newProps = {};
		propertiesWhiteList.forEach(key => {
			if (key in feature.properties) {
				newProps[key] = feature.properties[key];
			}
		});
		feature.properties = newProps;
	});

	// Write parsed projects data.
	await write_file('static/data/cache/parsed-projects.json', JSON.stringify({ projects: parsedProjects }));

	// Remove potentially obsolete cached processed file.
	if (fs.existsSync('static/data/cache/geo/RS.json')) {
		fs.unlinkSync('static/data/cache/geo/RS.json');
	}
	// Write GeoJson cached storage file.
	await write_file('static/data/cache/geo/RS.json', JSON.stringify(converted));
}

/**
 * Parses the description property from the raw GeoJson data.
 *
 * @param {Object} feature : a single feature object from the GeoJson raw data.
 * @returns {Object || Boolean} the GeoJson data or false.
 */
const parseGeoJsonDesc = feature => {
	if (!('description' in feature.properties) || !feature.properties.description.length) {
		return false;
	}

	const document = parser.parseFromString(feature.properties.description);
	if (!document) {
		return false;
	}

	const project = { geometry: feature.geometry };

	Array.from(document.getElementsByTagName("tr")).forEach((row, i) => {
		if (i < 2) {
			return;
		}

		let key = '';
		let val = '';

		for (let j = 0; j < row.childNodes.length; j++) {
			const textContent = row.childNodes[j].textContent.trim();

			if (textContent.length) {
				// Debug.
				// console.log(`${i}.${j} : ${textContent}`);

				if (j === 1) {
					key = textContent;
				} else {
					val = textContent;
				}
			}
		}

		if (key.length) {
			const cleanKey = slugify(key, { separator: '_' });
			project[cleanKey] = val;

			// Additional computed data : last event date.
			if (cleanKey === 'ultimo_evento') {
				project.modified = extractDateFromString(val);
			}
		}
	});

	// The project var will never be a Date object, so this test is fine.
	// See https://stackoverflow.com/a/32108184/2592338
	if (Object.keys(project).length === 0) {
		return false;
	}

	return project;
};

/**
 * Extracts last operation date from description column "ultimo evento".
 *
 * @param {String} str : the value containing the date.
 * 	Ex : '100 - REQ PESQ/REQUERIMENTO PESQUISA PROTOCOLIZADO EM 14/07/2014'
 * @returns {String} a string with only the date in format YYYY-MM-DD.
 * 	Ex : '2014/07/14'
 */
const extractDateFromString = str => {
	const matches = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
	console.log(matches);
	return `${matches[3]}/${matches[2]}/${matches[1]}`;
}

/**
 * Distributes projects by municipality.
 *
 * (Over)Writes Svelte routes corresponding to each municipality.
 *
 * @param {Array} projects : extracted data for all projects.
 * @returns {Object} projects keyed by slug of municipalities.
 */
const arrangeByMunicipality = async projects => {
	// Debug.
	console.log(projects);
}

/**
 * Regroups all operations in a single entry point.
 */
const updateKmzData = async projects => {
	if (fetchKmzFile()) {
		await unzipKmzFile();
	}
	extractGeoJsonData();
}

module.exports = {
	updateKmzData
};
