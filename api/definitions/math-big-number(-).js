'use strict'

const joi = require('joi')
const config = require('../config.json')
const regex = new RegExp(config.regex.bigNumber.decimal.fractional.negative)

const schema = joi.string().regex(regex).max(config.lengths.bigNumber.all.max)
  .description('big-number string for arbitrary-precision arithmetic')

module.exports = schema
