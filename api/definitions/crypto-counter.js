'use strict'

const schemas = require('@webwallet/schemas')('joi')
const schema = schemas.transaction.address.string

module.exports = schema
