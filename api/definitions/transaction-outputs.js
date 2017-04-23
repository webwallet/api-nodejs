'use strict'

const joi = require('joi')
const config = require('../config.json')
const outputs = config.items.transaction.outputs

const items = joi.object().keys({
  adr: joi.string().meta({className: 'crypto-address'}).required()
    .description('cryptographic address identifier'),
  bal: joi.string().meta({className: 'big-number-all'}).required()
    .description('number of units accounted by the output'),
  cru: joi.string().meta({className: 'crypto-unit-of-account'}).required()
    .description('unit of account in which the balance is denominated'),
  lim: {
    low: joi.alternatives().required().try(
      joi.string().meta({className: 'big-number-all'}),
      joi.string().valid('-Infinity')
    ).description('lower limit constraint for the balance property'),
    upp: joi.alternatives().required().try(
      joi.string().meta({className: 'big-number-all'}),
      joi.string().valid('Infinity')
    ).description('upper limit constraint for the balance property')
  },
  pre: joi.object({}).meta({className: 'transaction-pointers'})
    .description('pointers to the transaction outputs spent by this output')
})

const schema = joi.array().items(items).min(outputs.min).max(outputs.max)
  .description('transaction outputs (address state)')
  .options({stripUnknown: false})

module.exports = schema
