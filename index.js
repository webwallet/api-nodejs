'use strict'

require('dotenv').config()
const moduleAlias = require('module-alias') // custom local paths
moduleAlias.addAlias('@lib', __dirname + '/lib')
moduleAlias()
const express = require('express')
const Hashtable = require('./lib/clients/hashtable')
const Graphstore = require('./lib/clients/graphstore')
var bodyParser = require('body-parser')

const utils = require('@lib/utils')

const {getUnspentPointers, getOutputContents} = require('@lib/utils/transaction/getUnspentOutputs.js')
const getPreviousOutputs = require('./lib/utils/transaction/getPreviousOutputs')
const storeTransactionRecord = require('./lib/utils/transaction/storeTransactionRecord')

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
    
  api
    .use('/address/:address/outputs/history', require('./api/routes/address/_address/outputs/history/get').setup)
    .use('/address/:address/outputs/history', getPreviousOutputs)
    .use('/address/:address/outputs/unspent', getOutputContents)
    .get('/address/:address/outputs/history', require('./api/routes/address/_address/outputs/history/get').handler)
    
  api
    .use('/address/:address/outputs/unspent',require('./api/routes/address/_address/outputs/unspent/get').setup)
    .use('/address/:address/outputs/unspent', getUnspentPointers)
    .use('/address/:address/outputs/unspent', getOutputContents)
    .get('/address/:address/outputs/unspent',require('./api/routes/address/_address/outputs/unspent/get').handler)
    
  api.get('/iou/:iou', require('./api/routes/iou/_iou/get'))
    
  api
    .get('/transaction/:transaction', require('./api/routes/transaction/_transaction/get'))
    
  api
    .use('/transaction', require('./api/routes/transaction/post').setup)
    .use('/transaction', getUnspentPointers)
    .use('/transaction', getOutputContents)
    .use('/transaction', utils.transaction.feedPreviousToOutputs)
    .use('/transaction', utils.transaction.feedInputsToOutputs)
    .use('/transaction', function buildDocument(req, res, next) {

      let inputs = req.body.data.inputs
      let outputs = res.locals.newoutputs
      let transaction = utils.transaction.buildDocument({inputs, outputs})
      transaction.validate().hash().sign([])
      res.locals.transaction = transaction
      next()
    })
    .use('/transaction', storeTransactionRecord)
    .use('/transaction', async function querySpendTransactionOutputs(req, res, next) {
      let countspaces  = res.locals.countspaces
      let transaction = res.locals.transaction
      let queryParams = Object.assign({countspaces},
        utils.transaction.buildQueryParameters(transaction))
      let {transaction: graphTransaction, records} = await database.graphstore
        .query('spendTransactionOutputs', queryParams)
      
      res.locals.graphTransaction = graphTransaction
      res.locals.records = records
      next()
    })
    .post('/transaction',require('./api/routes/transaction/post').handler)


  api.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  return {api, graphstore, hashtable}
}

if (require.main === module) {
  init({port: process.env.PORT})
}

exports.init = init
