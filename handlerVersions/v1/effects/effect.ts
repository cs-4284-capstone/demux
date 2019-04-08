/**
 * This is an example Effect. Use Effects for executing non-deterministic mutative actions. They are run asynchronously,
 * and may be run concurrently with other effects. Make sure to export one (and only one) Effect object from this file.
 */

import { Effect, Block, StatelessActionCallback } from 'demux'
const http = require('http');

const run: StatelessActionCallback = async (payload: any, block: Block, context: any) => {
  let req = await http.get("http://localhost:3001/api/users"); //modify this to your api call
  //payload.data.from = the user that sent the transaction
  //payload.data.memo = the name of the song(note: only 1 song at a time for now on server)
}

const effect: Effect = {
  run,
  actionType: 'eosio.token::transfer', // The actionType this effect will subscribe to
  deferUntilIrreversible: true, // If true, the effect will only run after the action becomes irreversible
}

export default effect
