"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var demux_1 = require("demux");
var demux_eos_1 = require("demux-eos");
var demux_postgres_1 = require("demux-postgres");
var massive = require("massive");
var migrationSequences_1 = require("./migrationSequences");
//import * as dbConfig from './config/dbConfig.json'
var demuxConfig = require("./config/demuxConfig.json");
//import * as mongoConfig from './config/mongoConfig.json'
var handlerVersions_1 = require("./handlerVersions");
function env_req(varname) {
    var item = process.env[varname];
    if (typeof item === "string") {
        return item;
    }
    else {
        throw "Cannot read required environment variable: " + varname;
    }
}
function env_def(varname, def) {
    var item = process.env[varname];
    if (typeof item === "string") {
        return item;
    }
    else {
        return def;
    }
}
// An async init is created and then called to allow for `await`ing the setup code
var init = function () { return __awaiter(_this, void 0, void 0, function () {
    var mongo_endpoint, dbConfig, actionReader, massiveInstance, actionHandler, actionWatcher;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mongo_endpoint = "mongodb+srv://"
                    + env_req('MONGO_UNAME') + ":" + env_req('MONGO_PASS') + "@" + env_req('MONGO_HOST') + ":" + env_req('MONGO_PORT');
                dbConfig = {
                    user: env_req('POSTGRES_UNAME'),
                    password: env_req('POSTGRES_PASS'),
                    host: env_req('POSTGRES_HOST'),
                    port: parseInt(env_req('POSTGRES_PORT')),
                    database: env_req('POSTGRES_DBNAME')
                };
                actionReader = new demux_eos_1.MongoActionReader({
                    mongoEndpoint: mongo_endpoint,
                    dbName: process.env.MONGO_DBNAME,
                    startAtBlock: demuxConfig.startAtBlock,
                    onlyIrreversible: demuxConfig.onlyIrreversible
                });
                return [4 /*yield*/, actionReader.initialize()];
            case 1:
                _a.sent();
                return [4 /*yield*/, massive(dbConfig)];
            case 2:
                massiveInstance = _a.sent();
                actionHandler = new demux_postgres_1.MassiveActionHandler(handlerVersions_1.handlerVersions, massiveInstance, env_def('POSTGRES_SCHEMA', 'new33'), migrationSequences_1.migrationSequences);
                actionWatcher = new demux_1.ExpressActionWatcher(actionReader, actionHandler, demuxConfig.pollInterval, demuxConfig.endpointPort);
                return [4 /*yield*/, actionWatcher.listen()];
            case 3:
                _a.sent();
                console.info("Demux listening on port " + demuxConfig.endpointPort + "...");
                return [2 /*return*/];
        }
    });
}); };
init()["catch"](function (e) { return console.error("Uncaught error: " + e); });
