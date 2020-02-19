'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getUnspentPointers({database}, res,  next) {
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
  console.log('QUERRRRRYYYYYBEFOREEEE',queries)
  let pointers = await Promise.all(queries)
  console.log('POINTERRSSSBEFOREEEE',pointers)
  res.locals.pointers = pointers
  next()
}
async function getOutputContents({database}, res,  next) {
  let prev = res.locals.pointers

  console.log('GETOUTPUTCONTENTS',prev)
  
  let pointers = prev //.reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
  // let requests = pointers.map(async pointer => {
  //   let [id, index] = pointer.split(delimiter)
  //   let content = await database.hashtable.read.transaction.output({id, index})
  //   content = JSON.parse(stringify(content)) // sort alphabetically

  //   return {pointer, content}
  // })

  // let outputs =  Promise.all(requests)
  // res.locals.outputs = outputs
  next()
}

module.exports = {
  getUnspentPointers,
  getOutputContents
}
