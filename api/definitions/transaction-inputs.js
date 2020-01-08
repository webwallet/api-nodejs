'use strict'

const joi = require('joi')
const config = require('../config.json')
const inputs = config.items.transaction.inputs

const cryptoHashObject = require('./crypto-hash-object')
const transactionIouData = require('./transaction-iou-data')
const cryptoSignatures = require('./crypto-signatures')

const items = joi.object().keys({
  hash: cryptoHashObject.meta({className: 'crypto-hash-object'}).required(),
  data: transactionIouData.meta({className: 'transaction-iou-data'}).required(),
  meta: {
    signatures: cryptoSignatures.meta({className: 'crypto-signatures'}).required(),
    scripts: joi.array().optional()
  }
})

const schema = joi.array().items(items)
  .min(inputs.min).max(inputs.max).unique()
  .description('transaction inputs (IOUs)')
  .options({stripUnknown: false})

module.exports = schema
