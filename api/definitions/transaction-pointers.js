'use strict'

const joi = require('joi')
const config = require('../config.json')
const pointers = config.items.transaction.pointers
const regex = new RegExp(config.regex.transaction.pointer)
const {min, max} = config.lengths.transaction.pointer

const items = joi.string().regex(regex).min(min).max(max)
  .description('transaction pointer in {hash}::{index} format')

const schema = joi.array().items(items)
  .min(pointers.min).max(pointers.max).unique()
  .description('hash pointers to previous transaction outputs')
  .options({stripUnknown: false})

module.exports = schema
