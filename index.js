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

const {getUnspentPointers, getOutputContents} = require('./lib/utils/transaction/getUnspentOutputs.js')
const getPreviousOutputs = require('./lib/utils/transaction/getPreviousOutputs')
const storeTransactionRecord = require('./lib/utils/transaction/storeTransactionRecord')

const getTransactionByHash = require('./api/routes/transaction/_transaction/get')
const getIouByHash = require('./api/routes/iou/_iou/get')

const schemas = require('@webwallet/schemas')('joi')
const Joi = require('joi')

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


function validation(schema, property) {
  return (req, res, next) => {
    const { error } =  Joi.validate(req[property], Joi.object(schema))
    const valid = error == null; 
        if (!valid) { 
          res.status(422).json({ 
            message: 'Invalid request'
          }) 
        } else { 
        next()
        }
  }
}



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
    .use('/address/:address/outputs/history', validation(require('./api/schemas/address/_address/outputs/history/get').definitions.request.query, 'query'))
    .use('/address/:address/outputs/history', require('./api/routes/address/_address/outputs/history/get').setup)
    .use('/address/:address/outputs/history', getPreviousOutputs)
    .use('/address/:address/outputs/history', getOutputContents)
    .get('/address/:address/outputs/history', require('./api/routes/address/_address/outputs/history/get').handler)
    
  api
    .use('/address/:address/outputs/unspent', validation(require('./api/schemas/address/_address/outputs/unspent/get').definitions.request.query, 'query'))
    .get('/address/:address/outputs/unspent',require('./api/routes/address/_address/outputs/unspent/get').setup)
    .get('/address/:address/outputs/unspent', getUnspentPointers)
    .get('/address/:address/outputs/unspent', getOutputContents)
    .get('/address/:address/outputs/unspent',require('./api/routes/address/_address/outputs/unspent/get').handler)
    
  api
  .use('/iou/:iou', validation(require('./api/schemas/iou/_iou/get').definitions.request.path, 'params'))
  .get('/iou/:iou', getIouByHash)
    
  api
    .get('/transaction/:transaction', getTransactionByHash)
    
  api
    .post('/transaction', function validate(req, res, next) {
      const { body } = req
      const result = Joi.validate(body, schemas.transaction.request.object); 
      const { error } = result; 
      const valid = error == null; 
      if (!valid) { 
        res.status(422).json({ 
          message: 'Invalid request', 
          data: body 
        }) 
      } else { 
      next()
      } 
    })
    .post('/transaction', require('./api/routes/transaction/post').setup)
    .post('/transaction', getUnspentPointers)
    .post('/transaction', getOutputContents)
    .post('/transaction', utils.transaction.feedPreviousToOutputs)
    .post('/transaction', utils.transaction.feedInputsToOutputs)
    .post('/transaction', function buildDocument(req, res, next) {

      let inputs = req.body.data.inputs
      let outputs = res.locals.newoutputs
      let transaction = utils.transaction.buildDocument({inputs, outputs})
      transaction.validate().hash().sign([])
      res.locals.transaction = transaction
      next()
    })
    .post('/transaction', storeTransactionRecord)
    .post('/transaction', async function querySpendTransactionOutputs(req, res, next) {
      try {
        let database = req.database
        let countspaces  = res.locals.countspaces
        let transaction = res.locals.transaction
        let queryParams = Object.assign({countspaces},
          utils.transaction.buildQueryParameters(transaction))
        let {transaction: graphTransaction, records} = await database.graphstore
          .query('spendTransactionOutputs', queryParams)
        
        res.locals.graphTransaction = graphTransaction
        res.locals.records = records
        next()
      } catch(exception) {
        const { message } = exception
        const body = { error: { message } }
        res.status(404).send(body)
      }
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
