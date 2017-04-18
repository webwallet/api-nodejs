'use strict'

const joi = require('joi')

const schema = joi.object().keys({
  hash: joi.object({}).meta({className: 'crypto-hash-object'}),
  data: joi.object({}).meta({className: 'transaction-iou-data'}).required(),
  sigs: joi.object({}).meta({className: 'crypto-signature-object'})
})

module.exports = schema
