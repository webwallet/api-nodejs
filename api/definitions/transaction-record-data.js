'use strict'

const joi = require('joi')
const config = require('../config.json')

const schema = joi.object().keys({
  amounts: joi.object().meta({className: 'transaction-amounts(+)'}).required()
    .description('aggregate amount cleared per unit of account'),
  credit: joi.object().meta({className: 'transaction-amounts'})
    .description('aggregate allowance allocated per unit of account'),
  easing: joi.object().meta({className: 'transaction-amounts'})
    .description('aggregate amount issued per unit of account'),
  // config: joi.object().meta({className: 'transaction-configs'})
    // .description('configuration documents for addresses and units of account'),
  inputs: joi.object({}).meta({className: 'transaction-inputs'}).required(),
  outputs: joi.object({}).meta({className: 'transaction-outputs'}).required()
})

module.exports = schema
