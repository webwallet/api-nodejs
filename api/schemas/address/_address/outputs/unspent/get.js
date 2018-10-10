'use strict'

const joi = require('joi')

const schemas = {
  request: {
    path: {
      address: joi.string().meta({className: 'crypto-address'}).required()
    },
    query: {
      counter: joi.string().meta({className: 'crypto-counter'}).required(),
      limit: joi.number().integer().min(0).default(10),
      skip: joi.number().integer().min(0).default(0)
    } // todo: configuration values
  },
  responses: {
    default: {
      description: '',
      body: {},
      examples: {}
    }
  }
}

module.exports = {
  description: '',
  definitions: schemas,
  validations: {}
}
