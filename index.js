'use strict'

require('dotenv').config()
const moduleAlias = require('module-alias') // custom local paths
moduleAlias.addAlias('@lib', __dirname + '/lib')
moduleAlias()
const express = require('express')
const Hashtable = require('./lib/clients/hashtable')
const Graphstore = require('./lib/clients/graphstore')
var bodyParser = require('body-parser')

const  postTransaction= require('./api/routes/transaction/post')

const {getUnspentPointers, getOutputContents} = require('@lib/utils/transaction/getUnspentOutputs.js')


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
const delimiter = '::'

const stringify = require('json-stable-stringify')





async function init({port = 3000} = {}) {
  const [api, hashtable, graphstore] = await Promise.all([
    
    express(),
    // Hashtable.database.couchbase.connect(options.hashtable.couchbase),
    Hashtable.database.datastore.connect(options.hashtable.datastore),
    Graphstore.database.connect(options.graphstore)
  ])

  api.use(function (req, res, next) {
    req.database = {hashtable, graphstore}
    next()
  })
  

  api.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    
  api.get('/address/:address/outputs/history',(req, res) => require('./api/routes/address/_address/outputs/history/get')(req, res))
    
  api
    .use('/address/:address/outputs/unspent',require('./api/routes/address/_address/outputs/unspent/get').setup)
    .use('/address/:address/outputs/unspent', getUnspentPointers)
    .use('/address/:address/outputs/unspent', getOutputContents)
    .get('/address/:address/outputs/unspent',require('./api/routes/address/_address/outputs/unspent/get').handler)
    
  api
    .get('/iou/:iou', require('./api/routes/iou/_iou/get'))
    .get('/transaction/:transaction',(req, res) => require('./api/routes/transaction/_transaction/get')(req, res))
    .post('/transaction',(req, res) => postTransaction(req, res))


  api.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  return {api, graphstore, hashtable}
}

if (require.main === module) {
  init({port: process.env.PORT})
}

exports.init = init
