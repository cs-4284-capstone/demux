/**
 * This is an example Updater. Updaters are provided with a state object by your chosen ActionHandler, which should be
 * used to accumulate data based on the subscribed action's payload. Make sure that your function's logic is
 * deterministic, as it should yield the same results give the same action, payload, and state.
 *
 * Make sure to export one (and only one) Updater object from this file.
 */

import { Updater, BlockInfo, ActionCallback } from 'demux'

const apply: ActionCallback = async (state: any, payload: any, blockInfo: BlockInfo, context: any) => {
  console.log("begin");
  console.log(payload.data.from); //the name of the user who purchased the song
  console.log(payload.data.memo.split(";")[0]); //the song id
  console.log(payload.data.memo.split(";")[1]); //purchase id
}

const updater: Updater = {
  apply,
  actionType: 'eosio.token::transfer', // The actionType this effect will subscribe to
}

export default updater


