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
	return phasesColors[project.fase_id];
};

export { colorByPhase };
