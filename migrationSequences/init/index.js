"use strict";
/**
 * Exports a Migration[], instantiating Migrations of all SQL files in this directory into an array.
 *
 * This file is automatically updated via `demux generate migration [sequenceName] [migrationName]`.
 */
exports.__esModule = true;
var demux_postgres_1 = require("demux-postgres");
var dbConfig = require("../../config/dbConfig.json");
exports.init = [
    // MIGRATIONS START
    new demux_postgres_1.Migration('0000-migration', dbConfig.schema, __dirname + "/0000-migration.sql"),
];
