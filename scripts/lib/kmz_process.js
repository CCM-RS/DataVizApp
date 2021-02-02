/**
 * @file
 * Updates local copy of KMZ geo data from Sigmine, then converts and parses it.
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
const polyclip = require('martinez-polygon-clipping');

// Settings.
const rsKmzFileSource = 'http://sigmine.dnpm.gov.br/sirgas2000/RS.kmz';
const rsKmzFilePath = 'private/RS.kmz';
const kmzLocalCopyAgeLimit = 1000 * 60 * 60 * 24 * 31;
const rsRawGeoJsonFilePath = 'static/data/cache/raw_geo.json';

// Will restrict parsed items to X items.
// 0 = parse everything (~11.6K entries).
const debugCapItems = 150;

// TODO mutualize this map for rendering in Svelte.
const phasesMap = {
	dados_nao_cadastrados: 0,
	requerimento_de_pesquisa: 1,
	autorizacao_de_pesquisa: 2,
	direito_de_requerer_a_lavra: 3,
	requerimento_de_lavra: 4,
	concessao_de_lavra: 5,
	requerimento_de_lavra_garimpeira: 6,
	lavra_garimpeira: 7,
	requerimento_de_licenciamento: 8,
	licenciamento: 9,
	requerimento_de_registro_de_extracao: 10,
	registro_de_extracao: 11,
	manifesto_de_mina: 12,
	apto_para_disponibilidade: 13,
	disponibilidade: 14
};

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

	console.log("Downloading the KMZ file from SIGMINE...");

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
	return `${matches[3]}/${matches[2]}/${matches[1]}`;
}

/**
 * Distributes projects by municipality.
 *
 * TODO check all projects belong to at least 1 municipality ?
 * TODO (Over)Writes dynamically generated Svelte routes for each municipality ?
 *
 * @param {Array} projects : extracted data for all projects.
 * @returns {Object} projects keyed by slug of municipalities.
 */
const arrangeByMunicipality = projects => {
	const projectsByMunicipality = {};
	const municipalities = fs.readJsonSync('static/data/geo/geojs-43-mun.json');

	municipalities.features.forEach(municipality => {
		projects.forEach(project => {
			if (polyclip.intersection(project.geometry.coordinates, municipality.geometry.coordinates)) {
				const cleanKey = slugify(municipality.properties.name, { separator: '_' });

				// Alter the projects reference to implement mucupality as a filter.
				if ('municipality' in project && project.municipality.length) {
					project.municipality += ', ' + municipality.properties.name;
				} else {
					project.municipality = municipality.properties.name;
				}

				if (!(cleanKey in projectsByMunicipality)) {
					projectsByMunicipality[cleanKey] = [];
				}

				projectsByMunicipality[cleanKey].push(project);
			}
		});
	});

	return projectsByMunicipality;
}

/**
 * Distributes projects by phases.
 *
 * @param {Array} projects : extracted data for all projects.
 * @returns {Object} projects keyed by phase, and as many phase as there are
 * 	combinations of up to 4 phases.
 */
const arrangeByPhases = projects => {
	const projectsByPhases = {};
	const phases = [];

	projects.forEach(project => {
		const cleanKey = slugify(project.fase, { separator: '_' });

		// Can't deal with missing data here.
		if (!cleanKey || !cleanKey.length) {
			return;
		}

		if (!(cleanKey in projectsByPhases)) {
			projectsByPhases[cleanKey] = [];
		}
		projectsByPhases[cleanKey].push(project);

		if (!(cleanKey in phasesMap)) {
			console.log(`Missing key in phasesMap : ${cleanKey}`);
		} else {
			// Alter the projects reference to implement mucupality as a filter.
			project.phase_id = phasesMap[cleanKey];
		}
	});

	// More advanced projects are :
	projectsByPhases['phases_8_9_10_11_12_13'] = [];
	const advancedPhases = [
		'requerimento_de_licenciamento',
		'licenciamento',
		'requerimento_de_registro_de_extracao',
		'registro_de_extracao',
		'manifesto_de_mina',
		'apto_para_disponibilidade'
	];
	advancedPhases.forEach(cleanKey => {
		if (cleanKey in projectsByPhases && projectsByPhases[cleanKey].length) {
			projectsByPhases['phases_8_9_10_11_12_13'] = projectsByPhases['phases_8_9_10_11_12_13'].concat(projectsByPhases[cleanKey]);
		}
	});

	return projectsByPhases;
}

/**
 * Extracts structured data from the GeoJson object.
 */
const extractGeoJsonData = async converted => {
	if (!converted) {
		converted = await transformKmzFileToGeoJson();
	}

	let i;
	let j;
	const projects = [];
	const promises = [];

	// Extract data from description property and store parsed project data.
	converted.features.forEach((feature, i) => {
		const project = parseGeoJsonDesc(feature);
		if (project) {
			projects.push(project);
		}
	});

	// Sort by default on 'modified' date key (desc).
	projects.sort((a, b) => b.modified.localeCompare(a.modified));

	// Write 1 file per municipality.
	const projectsByMunicipality = arrangeByMunicipality(projects);
	Object.keys(projectsByMunicipality).forEach(cleanKey => {
		promises.push(
			write_file(
				`static/data/cache/projects/by-municipality/${cleanKey}.json`,
				JSON.stringify({ projects: projectsByMunicipality[cleanKey] })
			)
		);
	});

	// Writes 1 file per phase.
	const projectsByPhases = arrangeByPhases(projects);
	Object.keys(projectsByPhases).forEach(cleanKey => {
		promises.push(
			write_file(
				`static/data/cache/projects/by-phase/${cleanKey}.json`,
				JSON.stringify({ projects: projectsByPhases[cleanKey] })
			)
		);
	});

	// Write parsed projects data (all projects ~ 11.6K unles debugCapItems
	// setting is used).
	promises.push(
		write_file('static/data/cache/parsed-projects.json', JSON.stringify({ projects }))
	);

	await Promise.all(promises);
}

/**
 * Regroups all operations in a single entry point.
 */
const updateKmzData = async flush => {
	if (flush) {
		// Clear the local copy of the "raw" GeoJson data if it exists.
		// This will trigger a rebuild of most cache files without necessarily
		// re-fetching the remote KMZ source file(s).
		if (fs.existsSync(rsRawGeoJsonFilePath)) {
			fs.unlinkSync(rsRawGeoJsonFilePath);
		}
	}

	if (fetchKmzFile()) {
		await unzipKmzFile();
	}
	await extractGeoJsonData();
}

module.exports = {
	updateKmzData
};
