'use strict'

const Microapi = require('microapi/koa')
const Graphstore = require('./lib/clients/graphstore')
const Hashtable = require('./lib/clients/hashtable')

function databaseMiddleware(databases) {
  return async (context, next) => {
    context.database = databases
    await next()
  }
}

async function init({port = 3000} = {}) {
  const [api, graphstore, hashtable] = await Promise.all([
    new Microapi(),
    Graphstore.database.connect(),
    Hashtable.database.connect()
  ])

  api.use(databaseMiddleware({graphstore, hashtable}))
  api.define('./api')
  api.listen(port)

  return {api, graphstore, hashtable}
}

if (require.main === module) {
  init({port: process.env.PORT})
}

exports.init = init
