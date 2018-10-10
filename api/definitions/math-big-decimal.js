'use strict'

const schemas = require('@webwallet/schemas').joi
const schema = schemas.math.bignumber.decimal.integer.signed

module.exports = schema
