import { ExpressActionWatcher } from 'demux'
import { MongoActionReader } from 'demux-eos'
import { MassiveActionHandler } from 'demux-postgres'
import massive = require('massive');
import { migrationSequences } from './migrationSequences'
//import * as dbConfig from './config/dbConfig.json'
import * as demuxConfig from './config/demuxConfig.json'
//import * as mongoConfig from './config/mongoConfig.json'
import { handlerVersions } from './handlerVersions'

function env_req(varname:string): string {
  let item = process.env[varname]
  if (typeof item === "string") {
    return item
  } else {
    throw "Cannot read required environment variable: " + varname;
  }
}

function env_def(varname:string, def:string): string {
  let item = process.env[varname]
  if (typeof item === "string") {
    return item
  } else {
    return def
  }
}

// An async init is created and then called to allow for `await`ing the setup code
const init = async () => {
  const mongo_endpoint = "mongodb://" 
    + env_req('MONGO_UNAME') + ":" + env_req('MONGO_PASS') + "@" + env_req('MONGO_HOST')
  const dbConfig: massive.ConnectionInfo = {
    user: env_req('POSTGRES_UNAME'),
    password: env_req('POSTGRES_PASS'),
    host: env_req('POSTGRES_HOST'),
    port: parseInt(env_req('POSTGRES_PORT')),
    database: env_req('POSTGRES_DBNAME'),
  }

  const port = parseInt(env_def('DEMUX_PORT', '8282'))
  const actionReader = new MongoActionReader({
    mongoEndpoint: mongo_endpoint, // the endpoint that Mongodb is running at
    dbName: env_req('MONGO_DBNAME'), // the database name the Mongodb plugin was configured to use
    startAtBlock: demuxConfig.startAtBlock, // The block to begin indexing at. For values less than 1, this switches to a "tail" mode, where we start at an offset of the most recent blocks.
    onlyIrreversible: demuxConfig.onlyIrreversible, // if true, only blocks that have already reached irreversibility will be handled
  })

  console.log(mongo_endpoint)
  console.log(dbConfig)

  console.log("Starting Action Reader...")
  await actionReader.initialize();
  console.log("OK")

  const massiveInstance = await massive(dbConfig)
  const actionHandler = new MassiveActionHandler(
    handlerVersions,
    massiveInstance,
    env_def('POSTGRES_SCHEMA', 'new33'),
    migrationSequences,
  )
  const actionWatcher = new ExpressActionWatcher(
    actionReader,
    actionHandler,
    demuxConfig.pollInterval,
    port,
  )

  console.log("Starting Action Watcher...")
  await actionWatcher.listen()
  console.log("OK")
  console.info(`Demux listening on port ${port}...`)
}

init().catch((e) => console.error("*** ERR:" + e))
