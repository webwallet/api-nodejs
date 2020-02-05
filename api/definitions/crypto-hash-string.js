'use strict'

const schemas = require('@webwallet/schemas')('joi')
const schema = schemas.crypto.hash.string

module.exports = schema
