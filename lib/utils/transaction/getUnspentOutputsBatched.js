'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getUnspentOutputs({ countspaces, database, queryParams }) {
  let pointers = await getUnspentPointers({countspaces, database, queryParams})
  let contents = await getOutputContents({pointers, database})

  return contents
}

async function getUnspentPointers({ countspaces, database, queryParams }) {
  let { records } = await database.graphstore
    .query('getUnspentOutputsBatched', {countspaces, queryParams})
  let pointers = records.map(r => r.addresses.map(a => a.outputs))  
    .reduce((reduced, outputs = []) => reduced.concat(...outputs), [])

  return pointers
}

async function getOutputContents({ pointers, database }) {
  let hashes = pointers.map(pointer => pointer.split(delimiter)[0])
  hashes = Array.from(new Set(hashes))

  let response = await database.hashtable.read.transaction.record({id: hashes})
  response = JSON.parse(stringify(response)) // sort alphabetically
  let responseMap = new Map(response.map(({ id, body }) => ([id, body])))

  /* TODO: integrity validations! hash.value and hash(data) must match */

  let outputs = pointers.map(pointer => {
    let [hash, index] = pointer.split(delimiter)
    let output = responseMap.get(hash).data.outputs[index]
    return {pointer, content: output}
  })

  return outputs
}

module.exports = getUnspentOutputs
