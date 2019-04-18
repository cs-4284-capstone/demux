"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const demux_1 = require("demux");
const mongodb_1 = require("mongodb");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const MongoBlock_1 = require("./MongoBlock");
/**
 * Implementation of an ActionReader that reads blocks from a mongodb instance.
 */
class MongoActionReader extends demux_1.AbstractActionReader {
    constructor(options = {}) {
        super(options);
        this.requiredCollections = ['action_traces', 'block_states'];
        this.mongoEndpoint = options.mongoEndpoint ? options.mongoEndpoint : 'mongodb://127.0.0.1:27017';
        this.dbName = options.dbName ? options.dbName : 'EOS';
        this.mongodb = null;
    }
    getHeadBlockNumber(numRetries = 120, waitTimeMs = 250) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwIfNotInitialized();
            try {
                const blockNum = yield utils_1.retry(() => __awaiter(this, void 0, void 0, function* () {
                    const [blockInfo] = yield this.mongodb.collection('block_states')
                        .find({})
                        .limit(1)
                        .sort({ $natural: -1 })
                        .toArray();
                    return blockInfo.block_header_state.block_num;
                }), numRetries, waitTimeMs);
                return blockNum;
            }
            catch (err) {
                throw new errors_1.RetrieveHeadBlockError();
            }
        });
    }
    getLastIrreversibleBlockNumber(numRetries = 120, waitTimeMs = 250) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwIfNotInitialized();
            try {
                const irreversibleBlockNum = yield utils_1.retry(() => __awaiter(this, void 0, void 0, function* () {
                    const [blockInfo] = yield this.mongodb.collection('block_states')
                        .find({})
                        .limit(1)
                        .sort({ $natural: -1 })
                        .toArray();
                    return blockInfo.block_header_state.dpos_irreversible_blocknum;
                }), numRetries, waitTimeMs);
                return irreversibleBlockNum;
            }
            catch (err) {
                throw new errors_1.RetrieveIrreversibleBlockError();
            }
        });
    }
    getBlock(blockNumber, numRetries = 120, waitTimeMs = 250) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwIfNotInitialized();
            try {
                const mongoBlock = yield utils_1.retry(() => __awaiter(this, void 0, void 0, function* () {
                    const blockStates = yield this.mongodb.collection('block_states')
                        .find({ block_num: blockNumber })
                        .toArray();
                    this.validateBlockStates(blockStates, blockNumber);
                    const [blockState] = blockStates;
                    const rawActions = yield this.mongodb.collection('action_traces')
                        .find({
                        block_num: blockNumber,
                        producer_block_id: blockState.block_id,
                    })
                        .sort({ 'receipt.global_sequence': 1 })
                        .toArray();
                    return new MongoBlock_1.MongoBlock(blockState, rawActions);
                }), numRetries, waitTimeMs);
                return mongoBlock;
            }
            catch (err) {
                throw new errors_1.RetrieveBlockError();
            }
        });
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return;
            }
            const mongoInstance = yield mongodb_1.MongoClient.connect(this.mongoEndpoint, { useNewUrlParser: false });
            this.mongodb = yield mongoInstance.db(this.dbName);
            const dbCollections = yield this.mongodb.collections();
            if (dbCollections.length === 0) {
                throw new demux_1.NotInitializedError('There are no collections in the mongodb database.');
            }
            const dbCollectionsSet = new Set(dbCollections.map((c) => c.collectionName));
            const missingCollections = [];
            for (const collection of this.requiredCollections) {
                if (!dbCollectionsSet.has(collection)) {
                    missingCollections.push(collection);
                }
            }
            if (missingCollections.length > 0) {
                throw new demux_1.NotInitializedError(`The mongodb database is missing ${missingCollections.join(', ')} collections.`);
            }
        });
    }
    throwIfNotInitialized() {
        if (!this.mongodb) {
            throw new demux_1.NotInitializedError();
        }
    }
    validateBlockStates(blockStates, blockNumber) {
        if (blockStates.length === 0) {
            throw new errors_1.NoBlockStateFoundError(blockNumber);
        }
        else if (blockStates.length > 1) {
            throw new errors_1.MultipleBlockStateError(blockNumber);
        }
    }
}
exports.MongoActionReader = MongoActionReader;
//# sourceMappingURL=MongoActionReader.js.map