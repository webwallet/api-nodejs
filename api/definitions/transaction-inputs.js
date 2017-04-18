'use strict'

const joi = require('joi')

const items = joi.object().keys({
  hash: joi.object({}).meta({className: 'crypto-hash-object'}),
  data: joi.object({}).meta({className: 'transaction-iou-data'}).required(),
  sigs: joi.object({}).meta({className: 'crypto-signature-object'})
})

const schema = joi.array().items(items)
  .description('transaction inputs (IOUs)')
  .options({stripUnknown: false})

module.exports = schema
