'use strict'

const joi = require('joi')

const schemas = {
  request: {
    path: {
      address: joi.string().required().meta({className: 'crypto-address'})
    },
    query: {
      unit: joi.string().meta({className: 'crypto-unit-of-account'})
    }
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
