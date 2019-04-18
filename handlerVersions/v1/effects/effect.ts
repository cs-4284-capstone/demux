/**
 * This is an example Effect. Use Effects for executing non-deterministic mutative actions. They are run asynchronously,
 * and may be run concurrently with other effects. Make sure to export one (and only one) Effect object from this file.
 */

import { Effect, Block, StatelessActionCallback } from 'demux'
const http = require('http');

const run: StatelessActionCallback = async (payload: any, block: Block, context: any) => {
  //let req = await http.get("http://localhost:3001/api/users"); //modify this to your api call
  //payload.data.from = the user that sent the transaction
  //payload.data.memo.split(";")[0] = the id of the song(note: only 1 song id at a time for now)
  //payload.data.memo.split(";")[1] = the purchase id
  console.log("Recieved transaction!:")
  console.log("###PAYLOAD###")
  console.log(payload)
  console.log('###BLOCK###')
  console.log(block)
  console.log('###CONTEXT###')
  console.log(context)
  console.log("#######")

  const record = payload.data.memo.split(";");
  const songid = record[0];
  const purchaseid = record[1];
  const req = await http.get("http://admin:8000/api/purchases/" + purchaseid + "/send");
}

const effect: Effect = {
  run,
  actionType: 'eosio.token::transfer', // The actionType this effect will subscribe to
  deferUntilIrreversible: true, // If true, the effect will only run after the action becomes irreversible
}

export default effect
