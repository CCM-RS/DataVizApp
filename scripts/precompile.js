/**
 * Runs all compilation tasks that produce the necessary "intermediary" files
 * for static site generation.
 */

const { updateKmzData } = require('./lib/kmz_process.js');

updateKmzData();
// updateKmzData('highlights');


/*

// Debug tmp : only recompile highlights.
const fs = require('fs-extra');
const { write_file } = require('./lib/fs.js');

const projectsData = fs.readJsonSync('static/data/cache/projects/rs/all-projects.json');
const projects = projectsData.projects;

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

*/
