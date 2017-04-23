'use strict'

const joi = require('joi')
const config = require('../config.json')
const base58 = new RegExp(config.regex.base58)
const {min, max} = config.lengths.crypto.unitOfAccount

const schema = joi.string().alphanum().regex(base58).min(min).max(max)
  .description('alphanumeric identifier for a cryptographic unit of account')

module.exports = schema
