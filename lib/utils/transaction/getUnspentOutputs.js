'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getUnspentPointers({database}, res,  next) {
  let {wallets, queryParams}  = res.locals
  
  let addresses = Array.from(wallets.keys())
    .map(address => ({address, countspaces: wallets.get(address).countspaces}))
  
    let queries = addresses.map(async ({ address, countspaces }) => {
      let {transaction, records} = await database.graphstore
        .query('getUnspentOutputs', {address, countspaces, queryParams})
  
      let pointers = records
        .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
  
      return {address, pointers}
    })
    
    res.locals.pointers = Promise.all(queries)
    next()
}
async function getOutputContents({database}, res,  next) {
  
  let abomeyang = await res.locals.pointers
  let pointers = abomeyang.reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
  let requests = pointers.map(async pointer => {
    let [id, index] = pointer.split(delimiter)
    let content = await database.hashtable.read.transaction.output({id, index})
    content = JSON.parse(stringify(content)) // sort alphabetically

    return {pointer, content}
  })

  let outputs =  Promise.all(requests)
  res.locals.outputs = outputs
    next()
}

module.exports = {
  getUnspentPointers,
  getOutputContents
}
