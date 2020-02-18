'use strict'

function setup(req, res, next) {
  let wallets = new Map()
  wallets.set(params.address, {countspaces: [query.counter]})
  let {skip, limit} = query
  let queryParams = {skip, limit}
  res.locals.wallets = wallets
  res.locals.queryParams =  queryParams
  next()
}


async function handler(req, res) {
  let outputs = await res.locals.outputs
  res.send({data: {outputs}})
}

module.exports = {handler, setup}
