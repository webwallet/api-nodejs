'use strict'

const joi = require('joi')
const config = require('../config.json')
const bigNumber = require('./big-number')
const lengths = config.lengths.iou

const amount = {
  regex: bigNumber.decimal.fractional.positive,
  length: bigNumber.lengths.max
}

const schema = joi.object().keys({
  iss: joi.string().uri().max(lengths.issuer.max).required()
    .description('(issuer) webwallet domain'),
  sub: joi.string().meta({className: 'webwallet-address'}).required()
    .description('(subject) source of the transaction'),
  aud: joi.string().meta({className: 'webwallet-address'}).required()
    .description('(audience) destination of the transaction'),

  amt: joi.string().regex(amount.regex).max(amount.length).required()
    .description('(amount) number of units to offset on clearing'),
  cur: joi.string().meta({className: 'currency-unit'}).required()
    .description('(currency) unit of account identifier'),
  nce: joi.string().max(lengths.nonce.max).required()
    .description('(nonce) random value to prevent replay attacks'),

  iat: joi.date().iso().max('now').options({convert: true})
    .description('(issued at) for reference purpose only'),
  nbf: joi.date().iso().options({convert: true})
    .description('(not before) earliest valid date for clearing'),
  exp: joi.date().iso().required().options({convert: true})
    .description('(expires) latest valid date for clearing')
})


module.exports = schema