
const schemas = require('@webwallet/schemas').joi

const definitions = {
  request: {
    body: {
      data: schemas.transaction.request.data
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
  definitions,
  validations: {}
}
