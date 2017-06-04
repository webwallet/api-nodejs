'use strict'

async function getUnspentPointers({ wallets = [], database }) {
  let addresses = Array.from(wallets.keys())
  let queries = addresses.map(async address => {
    let countspaces = wallets.get(address).countspaces
    let {transaction, records} = await database.graphstore
      .query('getUnspentOutputs', {address, countspaces})

    let pointers = []
    for (let record of records) pointers.push(...record.pointers)

    return {address, pointers}
  })

  return Promise.all(queries)
}

module.exports = getUnspentPointers
