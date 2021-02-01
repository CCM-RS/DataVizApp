/**
 * Runs all compilation tasks that produce the necessary "intermediary" files
 * for static site generation.
 */

const { updateKmzData } = require('./lib/kmz_process.js');

updateKmzData();
