'use strict'

const utils = require('*lib/utils')

async function handler({ request, params, database }) {
  let wallets = new Map()
  wallets.set(params.address, {countspaces: [request.query.unit]})

  /* Get unspent transaction outputs in the given counstpaces */
  let outputs = await utils.transaction.getUnspentOutputs({wallets, database})

  return {body: {data: {outputs}}, status: 200}
}

module.exports = handler
