'use strict'

const schemas = require('@webwallet/schemas').joi
const schema = schemas.math.bignumber.decimal.integer.positive

module.exports = schema
