'use strict'

require('dotenv').config()
const moduleAlias = require('module-alias') // custom local paths
moduleAlias.addAlias('@lib', __dirname + '/lib')
moduleAlias()


const Microapi = require('microapi/koa')
const Hashtable = require('./lib/clients/hashtable')
const Graphstore = require('./lib/clients/graphstore')

let options = {
  hashtable: {
    datastore: {
      projectId: process.env.PROJECTID,
      apiEndpoint: process.env.APIENDPOINT,
      namespace: process.env.DATASTORE_NAMESPACE
    },
    couchbase: {
      host: process.env.COUCHHOST, name: process.env.COUCHNAME,
      auth: {username: process.env.COUCHUSER, password: process.env.COUCHPASS}
    }
  },
  graphstore: {
    scheme: process.env.GRAPHSCHEME,
    host: process.env.GRAPHHOST,
    auth: {password: process.env.GRAPHPASS}
  }
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
    // Hashtable.database.couchbase.connect(options.hashtable.couchbase),
    Hashtable.database.datastore.connect(options.hashtable.datastore),
    Graphstore.database.connect(options.graphstore)
  ])

  api.use(databaseMiddleware({graphstore, hashtable}))
  api.define(`${__dirname}/api`)
  api.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  return {api, graphstore, hashtable}
}

if (require.main === module) {
  init({port: process.env.PORT})
}

exports.init = init
