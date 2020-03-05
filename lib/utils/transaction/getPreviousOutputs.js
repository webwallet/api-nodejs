'use strict'

const delimiter = '::'
const stringify = require('json-stable-stringify')

async function getPreviousPointers({database}, res,  next) {
  try {
    let {wallets, queryParams}  = res.locals
    
    let addresses = Array.from(wallets.keys())
      .map(address => ({address, countspaces: wallets.get(address).countspaces}))
    
      let queries = await addresses.map(async ({ address, countspaces }) => {
        let {transaction, records} = await database.graphstore
          .query('getPreviousOutputs', {address, countspaces, queryParams})
    
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


module.exports = getPreviousPointers
