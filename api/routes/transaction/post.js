'use strict'

const utils = require('*lib/utils')

async function handler({ request, params, database }) {
  let inputs = request.body.data.inputs

  /* 0. Verify transaction integrity */
  await utils.iou.verifyCryptoIntegrity(inputs)

  /* 1. Extract wallet properties from input sources and targets */
  let {wallets, countspaces} = utils.iou.parseWalletProperties(inputs)
  /* 2. Get public keys for signature verification, if applicable */
  await utils.iou.findCryptoPublicKeys(inputs, wallets)
  /* 3. Verify digital signatures of all IOUs */
  let verification = await utils.iou.verifyCryptoSignatures(inputs, wallets)

  /* 4. Get previous unspent outputs and initialize new transaction outputs */
  let previous = await utils.transaction.getUnspentOutputs({wallets, database})
  let outputs = utils.transaction.buildOutputsMapping(wallets)
  /* 5. Combine inputs and previous outputs to compute new outputs */
  await utils.transaction.feedPreviousToOutputs(previous, outputs)
  await utils.transaction.feedInputsToOutputs(inputs, outputs)
  /* 6. Generate and validate transaction document */
  let transaction = utils.transaction.generateDocument({inputs, outputs})
  transaction.validate().hash().sign([])

  /* 7. Store transaction document in the hashtable database */
  let hashtableResult = await utils.transaction
    .storeTransactionRecord({transaction, database})
  /* 8. Send graphstore clearing query */
  let queryParams = Object.assign({countspaces},
    utils.transaction.buildQueryParameters(transaction))
  let {transaction: graphTransaction, records} = await database.graphstore
    .query('spendTransactionOutputs', queryParams)
  /* 9. Run post-query validations and commit / rollback */
  let validation = await utils.transaction.preCommitValidations(transaction, records)
  await utils.transaction.commitORRollback(validation, graphTransaction)

  return {body: validation.response, status: 200}
}

handler.exceptions = async function exceptions(context, exception) {
  let {message, details, stack} = exception
  let body = {error: {message, details}}
  let status = 400

  switch (exception.message) {
  case 'signature-verification-failed':
    break
  default:
    status = 500
    break
  }

  return {body, status}
}

module.exports = handler
