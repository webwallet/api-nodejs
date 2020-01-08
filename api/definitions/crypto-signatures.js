'use strict'

const schemas = require('@webwallet/schemas')('joi')
const schema = schemas.transaction.signature.array

module.exports = schema
