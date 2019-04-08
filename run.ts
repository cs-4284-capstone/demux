import { ExpressActionWatcher } from 'demux'
import { MongoActionReader } from 'demux-eos'
import { MassiveActionHandler } from 'demux-postgres'
import massive = require('massive');
import { migrationSequences } from './migrationSequences'
import * as dbConfig from './config/dbConfig.json'
import * as demuxConfig from './config/demuxConfig.json'
import * as mongoConfig from './config/mongoConfig.json'
import { handlerVersions } from './handlerVersions'

// An async init is created and then called to allow for `await`ing the setup code
const init = async () => {
  const actionReader = new MongoActionReader({
    mongoEndpoint: mongoConfig.host, // the endpoint that Mongodb is running at
    dbName: mongoConfig.dbName, // the database name the Mongodb plugin was configured to use
    startAtBlock: demuxConfig.startAtBlock, // The block to begin indexing at. For values less than 1, this switches to a "tail" mode, where we start at an offset of the most recent blocks.
    onlyIrreversible: demuxConfig.onlyIrreversible, // if true, only blocks that have already reached irreversibility will be handled
  })
  await actionReader.initialize();
  const massiveInstance = await massive(dbConfig)
  const actionHandler = new MassiveActionHandler(
    handlerVersions,
    massiveInstance,
    dbConfig.schema,
    migrationSequences,
  )
  const actionWatcher = new ExpressActionWatcher(
    actionReader,
    actionHandler,
    demuxConfig.pollInterval,
    demuxConfig.endpointPort,
  )

  await actionWatcher.listen()
  console.info(`Demux listening on port ${demuxConfig.endpointPort}...`)
}

init()
