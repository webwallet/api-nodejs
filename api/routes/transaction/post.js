'use strict'

const utils = require('*lib/utils')

module.exports = async function handler({ request, params, database }) {
  let transaction = {hash:{}, data: {}}
  let data = request.body.data

  /* 1. Extract wallet properties from input sources and targets */
  let wallets = utils.iou.parseWalletProperties(data.inputs)
  /* 2. Get public keys for signature verification, if applicable */
  /* 3. Verify digital signatures of all IOUs */

  /* 4. Get unspent transaction outputs */
  let outputs = await utils.transaction.getUnspentOutputs({wallets, database})
  /* 5. Compute new outputs */
  transaction.outputs = utils.transaction.buildOutputsArray(wallets)
  /* 6. Build transaction document */

  /* 7. Send graphstore clearing query */
  /* 8. Run post-query validations */
  /* 9. commit / rollback */

  return {body: 'post /transaction', status: 200}
}
