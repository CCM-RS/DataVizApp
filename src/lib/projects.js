
import slugify from "@sindresorhus/slugify";

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

const phasesColors = [
	'#000000',
	'#351ABA',
	'#283FCB',
	'#397FDD',
	'#4CB8EE',
	'#61E9FE',
	'#5AB9FF',
	'#547FFF',
	'#5E4DFF',
	'#9D47FF',
	'#E440FF',
	'#FF3AFF',
	'#FF34DA',
	'#FF2E88',
	'#FF282D',
	'#FF22AF'
];

/**
 * Gets the color corresponding to given phase.
 */
const colorByPhase = (project) => {
	const cleanKey = slugify(project.fase, { separator: '_' });
	return phasesColors[phasesMap[cleanKey]];
};

export { colorByPhase };
