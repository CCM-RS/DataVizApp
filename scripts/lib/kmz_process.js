/**
 * @file
 * Updates local copy of KMZ geo data from Sigmine, then converts and parses it.
 *
 * See https://www.gov.br/anm/pt-br/assuntos/acesso-a-sistemas/sistema-de-informacoes-geograficas-da-mineracao-sigmine
 *
 * Update :
 * See https://www.gov.br/anm/pt-br/assuntos/acesso-a-sistemas/geoinformacao-mineral
 * -> https://dados.gov.br/dataset/sistema-de-informacoes-geograficas-da-mineracao-sigmine
 *
 * RS :
 * https://dados.gov.br/dataset/sistema-de-informacoes-geograficas-da-mineracao-sigmine/resource/0d0f51e7-776d-4506-829d-b5e3e70662a4
 */

const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const Downloader = require('nodejs-file-downloader');
const { pipeline } = require('stream');
const tj = require('@mapbox/togeojson');
const { DOMParser } = require('xmldom');
const extract = require('extract-zip');
const { write_file } = require('./fs.js');
const slugify = require('@sindresorhus/slugify');
const polyclip = require('martinez-polygon-clipping');
const polylabel = require('polylabel');

// Settings.
const kmzLocalCopyAgeLimit = 1000 * 60 * 60 * 24 * 31;
const rsOutputCacheDir = 'static/data/cache/projects/rs';
// const rsKmzFileSource = 'http://sigmine.dnpm.gov.br/sirgas2000/RS.kmz';
const rsKmzFileSource = 'https://app.anm.gov.br/dadosabertos/SIGMINE/PROCESSOS_MINERARIOS/RS.kmz';
const rsKmzFileDestDir = 'private/geo/brazil/rs';
const rsKmzFilePath = rsKmzFileDestDir + '/RS.kmz';
const rsKmlFilePath = rsKmzFileDestDir + '/doc.kml';
const rsMunicipalitiesGeoJson = 'static/data/geo/geojs-43-mun.json';
const rsRawGeoJsonFilePath = rsOutputCacheDir + '/raw_geo.json';

// Will restrict parsed items to X items.
// 0 = parse everything (~11.6K entries).
const debugCapItems = 0;

const phasesMap = {
	dado_nao_cadastrado: 0,
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
const advancedPhases = [
	'direito_de_requerer_a_lavra', // 3
	'requerimento_de_lavra', // 4
	'concessao_de_lavra', // 5
	'requerimento_de_lavra_garimpeira', // 6
	'lavra_garimpeira', // 7
	'requerimento_de_licenciamento', // 8
	'licenciamento', // 9
	'requerimento_de_registro_de_extracao', // 10
	'registro_de_extracao', // 11
	'manifesto_de_mina', // 12
	'apto_para_disponibilidade', // 13
	'disponibilidade' // 14
];
const highlightsFilters = {
	fase_slug: advancedPhases,
	substance_slug: [
		'antracito',
		'carvao',
		'carvao_mineral',
		'chumbo',
		'cobre',
		'diamante',
		'ferro',
		'folhelho_betuminoso',
		'folhelho_pirobetumino',
		'fosfato',
		'linhito',
		'minerio_de_chumbo',
		'minerio_de_cobre',
		'minerio_de_ferro',
		'minerio_de_ouro',
		'minerio_de_prata',
		'minerio_de_titanio',
		'minerio_de_zinco',
		'prata',
		'rocha_betuminosa',
		'titanio'
	]
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
const fetchKmzFile = async (fileSource, fileDestDir, filePath, ageLimit, outputCacheDir) => {
	let requireDownload = false;
	let fileHasBeenUpdated = false;

	// Defaults. TODO [evol] if this code is to be used for other states, make
	// a proper module with optional settings.
	if (!fileSource) {
		fileSource = rsKmzFileSource;
	}
	if (!fileDestDir) {
		fileDestDir = rsKmzFileDestDir;
	}
	if (!filePath) {
		filePath = rsKmzFilePath;
	}
	if (!ageLimit) {
		ageLimit = kmzLocalCopyAgeLimit;
	}
	if (!outputCacheDir) {
		outputCacheDir = rsOutputCacheDir;
	}

	if (!fs.existsSync(filePath)) {
		requireDownload = true;
	} else {
		const stats = fs.statSync(filePath)
		const now = new Date().getTime();
		const lastModif = new Date(stats.mtime).getTime();

		if (now > ageLimit + lastModif) {
			requireDownload = true;
		}
	}

	// Nothing to do here if download is not required -> exit early.
	if (!requireDownload) {
		return;
	}

	// Delete obsolete version (if it exists) and previous cache entries.
	if (fs.existsSync(fileDestDir)) {
		fs.rmdirSync(fileDestDir, { recursive: true });
	}
	if (fs.existsSync(outputCacheDir)) {
		fs.rmdirSync(outputCacheDir, { recursive: true });
	}

	// Make sure destination dir exists.
	await mkdirp.sync(fileDestDir);

	console.log("Downloading the KMZ file from SIGMINE...");

	// Download the new, up to date version.
	const downloader = new Downloader({
		maxAttempts: 3,
		url: rsKmzFileSource,
		directory: rsKmzFileDestDir
	});

	try {
		await downloader.download();
		fileHasBeenUpdated = true;
	} catch (error) {
		console.error(error);
	}

	return fileHasBeenUpdated;
};

/**
 * Decompresses the KMZ source file.
 *
 * TODO [evol] use a dedicated sub-folder in case this code gets reused for
 * other states.
 */
const unzipKmzFile = async (fileDestDir, filePath) => {
	// Defaults.
	if (!fileDestDir) {
		fileDestDir = rsKmzFileDestDir;
	}
	if (!filePath) {
		filePath = rsKmzFilePath;
	}

	// Delete any potentially obsolete local unzipped copies (if they exist).
	const filesToClean = [rsKmlFilePath, fileDestDir + '/legend0.png'];
	filesToClean.forEach(f => {
		if (fs.existsSync(f)) {
			fs.unlinkSync(f);
		}
	});

	// Unzip KMZ to KML.
	try {
		await extract(filePath, { dir: path.resolve(fileDestDir) });
		console.log('Successfully extracted the KMZ file.');
	} catch (err) {
		console.error('Failed to unzip the KMZ file.', err);
		return false;
	}

	return true;
};

/**
 * Transforms it to geoJson format.
 *
 * @returns {Object} the GeoJson data.
 */
const transformToGeoJson = async (kmlFilePath, rawGeoJsonCacheFilePath) => {
	// Defaults.
	if (!kmlFilePath) {
		kmlFilePath = rsKmlFilePath
	}
	if (!rawGeoJsonCacheFilePath) {
		rawGeoJsonCacheFilePath = rsRawGeoJsonFilePath
	}

	// Avoid re-converting if a local copy of the "raw" GeoJson data exists.
	if (fs.existsSync(rawGeoJsonCacheFilePath)) {
		return fs.readJsonSync(rawGeoJsonCacheFilePath);
	}

	// Automatically attempt to fetch the missing file if it's missing.
	if (!fs.existsSync(kmlFilePath)) {
		await fetchKmzFile();
		await unzipKmzFile();
	}

	const kml = parser.parseFromString(fs.readFileSync(kmlFilePath, 'utf8'));
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
	if (!('geometry' in feature) || !('coordinates' in feature.geometry) || !feature.geometry.coordinates.length) {
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
	if (matches && matches.length) {
		return `${matches[3]}/${matches[2]}/${matches[1]}`;
	}
	return '';
}

/**
 * Distributes projects by municipality.
 *
 * @param {Array} projects : extracted data for all projects.
 * @returns {Object} projects keyed by slug of municipalities.
 */
const arrangeByMunicipality = projects => {
	const projectsByMunicipality = {};
	const municipalities = fs.readJsonSync(rsMunicipalitiesGeoJson);

	municipalities.features.forEach(municipality => {
		projects.forEach(project => {
			if (polyclip.intersection(project.geometry.coordinates, municipality.geometry.coordinates)) {
				const cleanKey = slugify(municipality.properties.name, { separator: '_' });

				// Alter the projects reference to implement this as a filter.
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
		}
	});

	// More advanced projects are :
	projectsByPhases['phases_8_9_10_11_12_13'] = [];
	advancedPhases.forEach(cleanKey => {
		if (cleanKey in projectsByPhases && projectsByPhases[cleanKey].length) {
			projectsByPhases['phases_8_9_10_11_12_13'] = projectsByPhases['phases_8_9_10_11_12_13'].concat(projectsByPhases[cleanKey]);
		}
	});

	return projectsByPhases;
}

/**
 * Distributes projects by substance.
 *
 * @param {Array} projects : extracted data for all projects.
 * @returns {Object} projects keyed by slug of substance.
 */
const arrangeBySubstance = projects => {
	const projectsBySubstance = {};
	projects.forEach(project => {
		if (!(project.substance_slug in projectsBySubstance)) {
			projectsBySubstance[project.substance_slug] = [];
		}
		projectsBySubstance[project.substance_slug].push(project);
	});
	return projectsBySubstance;
}

/**
 * Extracts structured data from the GeoJson object.
 *
 * Update : only extract highlights for now.
 */
const extractGeoJsonData = async (converted, outputCacheDir) => {
	// Defaults.
	if (!outputCacheDir) {
		outputCacheDir = rsOutputCacheDir;
	}

	// Automatically attempt to get the GeoJson source if it's missing.
	if (!converted) {
		converted = await transformToGeoJson();
	}

	let i;
	let j;
	const projects = [];
	const promises = [];

	// Extract data from description property and store parsed project data.
	converted.features.forEach((feature, i) => {
		const project = parseGeoJsonDesc(feature);
		if (project) {
			// Assign the slugified phase for optimized color matching.
			// @see src/lib/projects.js
			project.fase_slug = slugify(project.fase, { separator: '_' });
			project.fase_id = phasesMap[project.fase_slug];
			// Assign the substance_slug as well.
			project.substance_slug = slugify(project.substancia, { separator: '_' });
			// Assign the center of the polygon for easier Marker positionning.
			project.geometry.centerPoint = polylabel(project.geometry.coordinates, .4);
			projects.push(project);
		}
	});

	// Sort by default on 'modified' date key (desc).
	projects.sort((a, b) => b.modified.localeCompare(a.modified));

	// Write 1 file per municipality.
	// const projectsByMunicipality = arrangeByMunicipality(projects);
	// Object.keys(projectsByMunicipality).forEach(cleanKey => {
	// 	promises.push(
	// 		write_file(
	// 			`${outputCacheDir}/by-municipality/${cleanKey}.json`,
	// 			JSON.stringify({ projects: projectsByMunicipality[cleanKey] })
	// 		)
	// 	);
	// });

	// Writes 1 file per phase.
	// const projectsByPhases = arrangeByPhases(projects);
	// Object.keys(projectsByPhases).forEach(cleanKey => {
	// 	promises.push(
	// 		write_file(
	// 			`${outputCacheDir}/by-phase/${cleanKey}.json`,
	// 			JSON.stringify({ projects: projectsByPhases[cleanKey] })
	// 		)
	// 	);
	// });

	// Writes 1 file per substance.
	// const projectsBySubstance = arrangeBySubstance(projects);
	// Object.keys(projectsBySubstance).forEach(cleanKey => {
	// 	promises.push(
	// 		write_file(
	// 			`${outputCacheDir}/by-substance/${cleanKey}.json`,
	// 			JSON.stringify({ projects: projectsBySubstance[cleanKey] })
	// 		)
	// 	);
	// });

	// Write the highlights. These are the projects shown by default on the
	// homepage.
	const highlights = [];
	projects.forEach(project => {
		let matchAll = true;
		Object.keys(highlightsFilters).forEach(key => {
			if (!(key in project) || !highlightsFilters[key].includes(project[key])) {
				matchAll = false;
			}
		});
		if (matchAll) {
			highlights.push(project);
		}
	});
	promises.push(
		write_file(`${outputCacheDir}/highlights.json`, JSON.stringify({ projects: highlights }))
	);

	// Write total parsed projects data (all projects ~ 11.6K unles debugCapItems
	// setting is used).
	// promises.push(
	// 	write_file(`${outputCacheDir}/all-projects.json`, JSON.stringify({ projects }))
	// );

	await Promise.all(promises);
}

/**
 * Regroups all operations in a single entry point.
 */
const updateKmzData = async (flush, outputCacheDir) => {
	// Defaults.
	if (!outputCacheDir) {
		outputCacheDir = rsOutputCacheDir;
	}

	if (flush) {
		// Only rebuild the highligths.
		if (flush === 'highlights') {
			const projectsData = fs.readJsonSync('static/data/cache/projects/rs/all-projects.json');
			const projects = projectsData.projects;
			const highlights = [];

			projects.forEach(project => {
				let matchAll = true;
				Object.keys(highlightsFilters).forEach(key => {
					if (!highlightsFilters[key].includes(project[key])) {
						matchAll = false;
					}
				});
				if (matchAll) {
					highlights.push(project);
				}
			});

			write_file(`static/data/cache/projects/rs/highlights.json`, JSON.stringify({ projects: highlights }));

			// Do not process the rest.
			return;
		} else {
			// This will trigger a rebuild of all cache files without necessarily
			// re-fetching the remote KMZ source file(s).
			if (fs.existsSync(outputCacheDir)) {
				fs.rmdirSync(outputCacheDir, { recursive: true });
			}
		}
	}

	if (await fetchKmzFile()) {
		await unzipKmzFile();
	}
	await extractGeoJsonData();
}

module.exports = {
	updateKmzData
};
