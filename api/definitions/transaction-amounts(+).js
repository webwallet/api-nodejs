'use strict'

const joi = require('joi')
const config = require('../config.json')
const unitsOfAccount = config.items.transaction.unitsOfAccount

const items = joi.object().keys({
  cru: joi.object({}).meta({className: 'crypto-unit-of-account'}).required(),
  val: joi.object({}).meta({className: 'big-number(+)'}).required()
})

const schema = joi.array().items(items).unique()
  .min(unitsOfAccount.min).max(unitsOfAccount.max)
  .description('positive big-number amounts per unit of account')
  .options({stripUnknown: false})

module.exports = schema
