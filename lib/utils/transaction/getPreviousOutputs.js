'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getPreviousPointers({database}, res,  next) {
  let {wallets, queryParams}  = res.locals
  
  let addresses = Array.from(wallets.keys())
    .map(address => ({address, countspaces: wallets.get(address).countspaces}))
  
    let queries = addresses.map(async ({ address, countspaces }) => {
      let {transaction, records} = await database.graphstore
        .query('getPreviousOutputs', {address, countspaces, queryParams})
  
      let pointers = records
        .reduce((reduced, {pointers = []} = {}) => reduced.concat(...pointers), [])
  
      return {address, pointers}
    })
    
    res.locals.pointers = Promise.all(queries)
    next()
}


module.exports = getPreviousPointers
