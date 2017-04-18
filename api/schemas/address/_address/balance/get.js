'use strict'

const joi = require('joi')

const schemas = {
  request: {
    path: {
      address: joi.string().required().meta({className: 'webwallet-address'})
    },
    query: {
      currency: joi.string().meta({className: 'currency-unit'})
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
