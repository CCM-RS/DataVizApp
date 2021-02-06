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

const substancesNormalizeMap = {
	'chumbo': 'lead',
	'cobre': 'copper',
	'diamante': 'diamond',
	'ferro': 'iron',
	'folhelho_betuminoso': 'shale-ore',
	'folhelho_pirobetumino': 'shale-ore',
	'fosfato': 'phosphate',
	'linhito': 'lignite',
	'minerio_de_chumbo': 'lead',
	'minerio_de_cobre': 'copper',
	'minerio_de_ferro': 'iron',
	'minerio_de_ouro': 'gold',
	'minerio_de_prata': 'silver',
	'minerio_de_titanio': 'titanium',
	'minerio_de_zinco': 'zinc',
	'ouro': 'gold',
	'prata': 'silver',
	'rocha_betuminosa': 'shale-ore',
	'titanio': 'titanium'
};

/**
 * Gets the color corresponding to given phase.
 */
const colorByPhase = (project) => {
	return phasesColors[project.fase_id];
};

/**
 * Gets the SVG icon path by substance.
 *
 * TODO provide a better default value than coal ?
 */
const iconBySubstance = (project) => {
	if (!(project.substance_slug in substancesNormalizeMap)) {
		return '/svg/coal.svg';
	}
	return `/svg/${substancesNormalizeMap[project.substance_slug]}.svg`;
};

export { colorByPhase, iconBySubstance };
