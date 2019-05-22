'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getUnspentOutputs({ wallets, database, queryParams }) {
  let addresses = Array.from(wallets.keys())
    .map(address => ({address, countspaces: wallets.get(address).countspaces}))
  let pointers = (await getUnspentPointers({addresses, database, queryParams}))
    .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
  let outputs = await getOutputContents({pointers, database})

  return outputs
}

async function getUnspentPointers({ addresses, database, queryParams }) {
  let queries = addresses.map(async ({ address, countspaces }) => {
    let {transaction, records} = await database.graphstore
      .query('getUnspentOutputs', {address, countspaces, queryParams})

    let pointers = records
      .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])

    return {address, pointers}
  })

  return Promise.all(queries)
}

function getOutputContents({ pointers, database }) {
  let requests = pointers.map(async pointer => {
    let [id, index] = pointer.split(delimiter)
    let content = await database.hashtable.read.transaction.output({id, index})
    content = JSON.parse(stringify(content)) // sort alphabetically

    return {pointer, content}
  })

  return Promise.all(requests)
}

module.exports = getUnspentOutputs
