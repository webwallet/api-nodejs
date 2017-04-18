'use strict'

const joi = require('joi')
const config = require('../config.json')
const inputs = {items: config.items.transaction.inputs}
const transactionInput = require('./transaction-input')

const schema = joi.object().keys({
  inputs: joi.array().required().min(inputs.items.min).max(inputs.items.max)
    .items(transactionInput.meta({className: 'transaction-input'}))
    .description('transaction inputs (IOUs)')
    .options({stripUnknown: false})
})

module.exports = schema
