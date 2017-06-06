'use strict'

const utils = require('*lib/utils')

module.exports = async function handler({ request, params, database }) {
  let inputs = request.body.data.inputs

  /* 1. Extract wallet properties from input sources and targets */
  let wallets = utils.iou.parseWalletProperties(inputs)
  /* 2. Get public keys for signature verification, if applicable */
  /* 3. Verify digital signatures of all IOUs */

  /* 4. Get previous unspent outputs and initialize new transaction outputs */
  let previous = await utils.transaction.getUnspentOutputs({wallets, database})
  let outputs = utils.transaction.buildOutputMapping(wallets)
  /* 5. Combine inputs and previous outputs to compute new outputs */
  await utils.transaction.feedPreviousToOutputs(previous, outputs)
  await utils.transaction.feedInputsToOutputs(inputs, outputs)
  /* 6. Generate and validate transaction document */


  /* 7. Send graphstore clearing query */
  /* 8. Run post-query validations */
  /* 9. commit / rollback */

  return {body: 'post /transaction', status: 200}
}
