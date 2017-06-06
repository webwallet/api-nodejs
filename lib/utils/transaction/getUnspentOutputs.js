'use strict'

async function getUnspentOutputs({ wallets, database }) {
  let addresses = Array.from(wallets.keys())
    .map(address => ({address, countspaces: wallets.get(address).countspaces}))
  let pointers = (await getUnspentPointers({addresses, database}))
    .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
  let outputs = await getOutputContents({pointers, database})

  return outputs
}

async function getUnspentPointers({ addresses, database }) {
  let queries = addresses.map(async ({ address, countspaces }) => {
    let {transaction, records} = await database.graphstore
      .query('getUnspentOutputs', {address, countspaces})
    let pointers = records
      .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])

    return {address, pointers}
  })

  return Promise.all(queries)
}

function getOutputContents({ pointers, database }) {
  let requests = pointers.map(async pointer => {
    let [id, index] = pointer.split('::')
    let content = await database.hashtable.read.transaction.outputs({id, index})
    return {pointer, content}
  })

  return Promise.all(requests)
}

module.exports = getUnspentOutputs
