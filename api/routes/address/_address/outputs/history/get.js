'use strict'

const utils = require('@lib/utils')

function setup({params, query}, res, next) {
  let wallets = new Map()
  wallets.set(params.address, {countspaces: [query.counter]})
  let {skip, limit} = query
  let queryParams = {skip, limit}
  res.locals.wallets = wallets
  res.locals.queryParams =  queryParams
  next()
}

async function handler(req, res) {
  try {
    let outputs = await res.locals.outputs
    res.send({data: {outputs}})
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}

module.exports = {handler, setup}
