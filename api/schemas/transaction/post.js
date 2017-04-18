const joi = require('joi')

const schemas = {
  request: {
    body: {
      hash: joi.object({}).meta({className: 'crypto-hash-object'}).required(),
      data: joi.object({}).meta({className: 'transaction-request-data'}).required(),
      sigs: joi.object({}).meta({className: 'crypto-signatures-array'})
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
