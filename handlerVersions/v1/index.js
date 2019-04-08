"use strict";
/**
 * This exports the HandlerVersion, which contains this version's Updaters and Effects.
 *
 * You should only need to change this file if you have changed the name of your HandlerVersion.
 */
exports.__esModule = true;
var updaters_1 = require("./updaters");
var effects_1 = require("./effects");
exports.v1 = {
    versionName: 'v1',
    updaters: updaters_1.updaters,
    effects: effects_1.effects
};
