"use strict";
/**
 * Exports the MigrationSequences to be used by the MassiveActionHandler. Their names are taken from the names of the
 * directories in this directory.
 *
 * This file is automatically updated via `demux generate migration [sequenceName] [migrationName]` when the
 * provided `sequenceName` does not exist yet and is created.
 */
exports.__esModule = true;
// IMPORT START
var init_1 = require("./init");
// IMPORT END
exports.migrationSequences = [
    // SEQUENCES START
    {
        sequenceName: 'init',
        migrations: init_1.init
    },
];
