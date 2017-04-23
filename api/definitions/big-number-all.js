'use strict'

const joi = require('joi')
const config = require('../config.json')

const schema = joi.string().max(config.lengths.bigNumber.all.max)
  .regex(new RegExp(config.regex.bigNumber.decimal.fractional.all))
  .description('big-number string for arbitrary-precision arithmetic')

module.exports = schema
