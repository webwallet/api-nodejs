'use strict'

const schemas = require('@webwallet/schemas')('joi')
const schema = schemas.crypto.keys.public.string

module.exports = schema
