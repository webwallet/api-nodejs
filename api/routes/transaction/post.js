'use strict'

const utils = require('*lib/utils')

module.exports = async function handler({ request, params, database }) {
  let inputs = request.body.data.inputs

  /* 1. Extract wallet properties from input sources and targets */
  let {wallets, countspaces} = utils.iou.parseWalletProperties(inputs)
  /* 2. Get public keys for signature verification, if applicable */
  /* 3. Verify digital signatures of all IOUs */

  /* 4. Get previous unspent outputs and initialize new transaction outputs */
  let previous = await utils.transaction.getUnspentOutputs({wallets, database})
  let outputs = utils.transaction.buildOutputMapping(wallets)
  /* 5. Combine inputs and previous outputs to compute new outputs */
  await utils.transaction.feedPreviousToOutputs(previous, outputs)
  await utils.transaction.feedInputsToOutputs(inputs, outputs)
  /* 6. Generate and validate transaction document */
  let transaction = utils.transaction.generateDocument({inputs})
  transaction.data.outputs = utils.convertMapToArray(outputs)
  transaction.hash().sign([])

  /* 7. Store transaction document in the hashtable database */
  let hashtableResult = await utils.transaction
    .storeTransactionRecord({transaction, database})
  /* 8. Send graphstore clearing query and run post-query validations */
  let queryParams = utils.transaction.buildQueryParameters(transaction)
  queryParams.countspaces = countspaces
  let graphQuery = await database.graphstore
    .query('spendTransactionOutputs', queryParams)
  /* 9. commit / rollback */
  graphQuery.transaction.commit()

  return {body: 'post /transaction', status: 200}
}
