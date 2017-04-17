'use strict'

const joi = require('joi')

const schemas = {
  request: {
    path: {
      currency: joi.string().required().meta({className: 'currency-unit'})
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
