'use strict'

const joi = require('joi')
const config = require('../config.json')
const regex = config.regex.bigNumber

const schema = {
  decimal: {
   fractional: {
     positive: new RegExp(regex.decimal.fractional.positive)
   }
 },
 lengths: {
   max: config.lengths.bigNumber.all.max
 }
}

module.exports = schema
