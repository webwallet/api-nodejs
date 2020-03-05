'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getUnspentPointers({database}, res,  next) {
  try {
    let {wallets, queryParams}  = res.locals
    let addresses = Array.from(wallets.keys())
      .map(address => ({address, countspaces: wallets.get(address).countspaces}))
    
    let queries = await addresses.map(async ({ address, countspaces }) => {
      let {transaction, records} = await database.graphstore
        .query('getUnspentOutputs', {address, countspaces, queryParams})

      let pointers = records
        .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])

      return {address, pointers}
    })
    let pointers = await Promise.all(queries)
    res.locals.pointers = pointers
    next()
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}
async function getOutputContents({database}, res,  next) {
  try {
    let prev = res.locals.pointers
    
    let pointers = prev.reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
    let requests = pointers.map(async pointer => {
      let [id, index] = pointer.split(delimiter)
      let content = await database.hashtable.read.transaction.output({id, index})
      content = JSON.parse(stringify(content)) // sort alphabetically

      return {pointer, content}
    })

    let outputs =  await Promise.all(requests)
    res.locals.outputs = outputs
    next()
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}

module.exports = {
  getUnspentPointers,
  getOutputContents
}
