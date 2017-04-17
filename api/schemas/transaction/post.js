const joi = require('joi')

const schemas = {
  request: {
    body: {
      hash: joi.object({}).meta({className: 'hash-object'}).required(),
      data: joi.object({}).meta({className: 'transaction-data-post'}).required(),
      sigs: joi.object({}).meta({className: 'signatures-array'})
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
