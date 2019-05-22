
const schemas = require('@webwallet/schemas')('joi')

const definitions = {
  request: {
    body: schemas.transaction.request.object
      .meta({className: 'transaction-request-object'})
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
