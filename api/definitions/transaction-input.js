'use strict'

const joi = require('joi')

const schema = joi.object().keys({
  hash: joi.object({}).meta({className: 'hash-object'}),
  data: joi.object({}).meta({className: 'iou-data'}).required(),
  sigs: joi.object({}).meta({className: 'signature-object'})
})

module.exports = schema
