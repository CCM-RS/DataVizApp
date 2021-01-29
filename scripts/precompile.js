/**
 * Runs all compilation tasks that produce the necessary "intermediary" files
 * for static site generation.
 *
 * WIP periodically update local copy of http://sigmine.dnpm.gov.br/sirgas2000/RS.kmz
 * (via https://www.gov.br/anm/pt-br/assuntos/acesso-a-sistemas/sistema-de-informacoes-geograficas-da-mineracao-sigmine)
 * then parse + convert using https://github.com/mapbox/togeojson
 * for display with https://github.com/anoram/leaflet-svelte
 * see https://leaflet.anoram.com/examples/dynamicmarker
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { pipeline } = require('stream');
const tj = require('@mapbox/togeojson');
const { DOMParser } = require('xmldom');
const extract = require('extract-zip');
const { write_file } = require('./lib/fs.js');
const slugify = require('@sindresorhus/slugify');

const rsKmzFilePath = 'private/RS.kmz';

/**
 * Fetches KMZ source file for RS only if local file is older than 31 days.
 */
const fetchKmzFile = filePath => {
	let requireDownload = false;
	let fileHasBeenUpdated = false;
	const ageLimit = 1000 * 60 * 60 * 24 * 31;

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
		fs.unlink(filePath, err => {
			if (err) {
				console.error('Failed to remove the old KMZ local copy.', err);
			}
		});
	}

	// Download the new, up to date version.
	// @see https://stackoverflow.com/a/60684836/2592338
	const fileWriteStream = fs.createWriteStream(filePath);
	http.get('http://sigmine.dnpm.gov.br/sirgas2000/RS.kmz', response => {
		pipeline(response, fileWriteStream, err => {
			if (err) {
				console.error('Failed to download the KMZ file from SIGMINE.', err);
				fs.unlink(filePath, err => {
					if (err) {
						console.error('Failed to remove the fileWriteStream placeholder file.', err);
					}
				});
			} else {
				fileHasBeenUpdated = true;
				console.log('Successfully downloaded the KMZ file from SIGMINE.');
			}
		});
	});

	return fileHasBeenUpdated;
};

/**
 * Extracts the KMZ source file.
 */
const extractKmzFile = async filePath => {
	// Delete any potentially obsolete local unzipped copies (if they exist).
	const filesToClean = ['private/doc.kml', 'private/legend0.png'];
	filesToClean.forEach(f => {
		if (fs.existsSync(f)) {
			fs.unlink(f, err => {
				if (err) {
					console.error(`Failed to remove the old '${f}' local copy.`, err);
					return false;
				}
			});
		}
	});

	// Unzip KMZ to KML.
	try {
		await extract(filePath, { dir: path.resolve('private') });
		console.log('Successfully extracted the KMZ file.');
	} catch (err) {
		console.error('Failed to unzip the KMZ file.', err);
		return false;
	}

	return true;
};

/**
 * Transforms it to geoJson format.
 */
const transformKmzFile = async filePath => {
	let i;
	const parsedProjects = [];
	const parser = new DOMParser({
		locator: {},
		errorHandler: {
			warning: w => {},
			error: e => {},
			fatalError: e => console.error(e)
		}
	});
	const kml = parser.parseFromString(fs.readFileSync('private/doc.kml', 'utf8'));

	if (!kml) {
		console.error('Failed to parse KML file.', err);
		return false;
	}

	const converted = tj.kml(kml);

	if (!converted || !('features' in converted)) {
		console.error('Failed to convert KML file.', err);
		return false;
	}

	// debug.
	// console.log(Object.keys(converted));

	// Filter features properties.
	const propertiesWhiteList = ['name', 'stroke', 'stroke-width', 'fill'];

	// Debug : only keep a few random shapes to test.
	for (i = converted.features.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[converted.features[i], converted.features[j]] = [converted.features[j], converted.features[i]];
	}
	converted.features.splice(0, converted.features.length - 300);

	converted.features.forEach((feature, i) => {
		const project = {};
		const newProps = {};

		propertiesWhiteList.forEach(key => {
			if (key in feature.properties) {
				newProps[key] = feature.properties[key];
			}
		});

		// Extract data from description property.
		if ('description' in feature.properties && feature.properties.description.length) {
			const document = parser.parseFromString(feature.properties.description);

			if (!document) {
				return;
			}

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
					project[slugify(key)] = val;
				}
			});
		}

		// Store parsed project data.
		parsedProjects.push(project);

		// Debug.
		// console.log(project);

		// Prune non-geographical data for GeoJson cached storage.
		feature.properties = newProps;
	});

	// Remove potentially obsolete cached processed file.
	if (fs.existsSync('static/data/cache/geo/RS.json')) {
		fs.unlink('static/data/cache/geo/RS.json', err => {
			if (err) {
				console.error(`Failed to remove the old 'static/data/cache/geo/RS.json' cached processed file.`, err);
			}
		});
	}

	// Write parsed projects data.
	await write_file('static/data/cache/parsed-projects.json', JSON.stringify({ projects: parsedProjects }));

	// Write GeoJson cached storage file.
	await write_file('static/data/cache/geo/RS.json', JSON.stringify(converted));
}


// Debug (WIP test local).
// if (fetchKmzFile(rsKmzFilePath)) {
// 	if (await extractKmzFile(rsKmzFilePath)) {
// 		await transformKmzFile(rsKmzFilePath);
// 	}
// }

// transformKmzFile(rsKmzFilePath);
