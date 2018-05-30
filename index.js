'use strict'

let dotenv = require('dotenv').config()

const Microapi = require('microapi/koa')
const Hashtable = require('./lib/clients/hashtable')
const Graphstore = require('./lib/clients/graphstore')

let options = {
  hashtable: {host: process.env.COUCHHOST, name: process.env.COUCHNAME,
    auth: {username: process.env.COUCHUSER, password: process.env.COUCHPASS}},
  graphstore: {host: process.env.GRAPHHOST, auth: {password: process.env.GRAPHPASS}}
}

function databaseMiddleware(databases) {
  return async (context, next) => {
    context.database = databases
    await next()
  }
}

async function init({port = 3000} = {}) {
  const [api, hashtable, graphstore] = await Promise.all([
    new Microapi(),
    Hashtable.database.connect(options.hashtable),
    Graphstore.database.connect(options.graphstore)
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
