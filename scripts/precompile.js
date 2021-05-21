/**
 * Runs all compilation tasks that produce the necessary "intermediary" files
 * for static site generation.
 *
 * Usage :
 * 	$ node scripts/precompile.js
 */

const { updateKmzData } = require('./lib/kmz_process.js');

const zones = [
	{
		"region": "rs",
		// "debugCapItems": 33,
		// "rebuild": "everything",
		"initialView": [ -30.020949, -51.4108658 ]
	}
];

zones.forEach(settings => updateKmzData(settings));
