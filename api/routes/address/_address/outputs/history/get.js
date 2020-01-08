'use strict'

const utils = require('@lib/utils')

async function handler({ request, params, database }) {
  let wallets = new Map()
  wallets.set(params.address, {countspaces: [request.query.counter]})

  let {skip, limit} = request.query
  let queryParams = {skip, limit}

  /* Get unspent transaction outputs in the given counstpaces */
  let outputs = await utils.transaction
    .getPreviousOutputs({wallets, database, queryParams})

  return {body: {data: {outputs}}, status: 200}
}

module.exports = handler
