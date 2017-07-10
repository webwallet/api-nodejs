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
    Graphstore.database.connect({host: process.env.GRAPHHOST, auth: {password: process.env.GRAPHPASS}}),
    Hashtable.database.connect({host: process.env.COUCHHOST, name: 'hashtable', auth: {password: process.env.COUCHPASS}})
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
