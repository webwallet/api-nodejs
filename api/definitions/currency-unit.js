'use strict'

const joi = require('joi')
const config = require('../config.json')
const base58 = new RegExp(config.regex.base58)
const {min, max} = config.lengths.currency.id

const schema = joi.string().alphanum().regex(base58).min(min).max(max)
  .description('alphanumeric identifier for a currency unit')

module.exports = schema
