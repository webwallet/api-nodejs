'use strict'

const joi = require('joi')
const transactionInputs = require('./transaction-inputs')

const schema = joi.object().keys({
  inputs: joi.object({}).required().meta({className: 'transaction-inputs'})
    .description('transaction request inputs (IOUs)')
})

module.exports = schema
