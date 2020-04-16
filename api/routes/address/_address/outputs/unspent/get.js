'use strict'

async function setup({params, query}, res, next) {
  try {
    let wallets = new Map()
    wallets.set(params.address, {countspaces: [query.counter]})
    let {skip, limit} = query
    let queryParams = {skip, limit}
    res.locals.wallets = wallets
    res.locals.queryParams =  queryParams
    next()
  } catch (error) {
    error.status = 500
    next(error)
  }
}

async function handler(req, res, next) {
  try {
    let outputs = await res.locals.outputs
    res.send({data: {outputs}})
  } catch (error) {
    error.status = 500
    next(error)
  }
}

module.exports = {handler, setup}
