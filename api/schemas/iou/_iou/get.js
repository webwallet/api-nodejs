'use strict'

const joi = require('joi')

const schemas = {
  request: {
    path: {
      iou: joi.string().meta({className: 'crypto-hash-string'}).required()
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
