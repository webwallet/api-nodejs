'use strict'

const joi = require('joi')
const config = require('../config.json')

const lengths = config.lengths.transaction.iou

const schema = joi.object().keys({
  iss: joi.string().uri().max(lengths.issuer.max).required()
    .description('(issuer) transaction clearing domain'),
  sub: joi.string().meta({className: 'crypto-address'}).required()
    .description('(subject) source of the transaction'),
  aud: joi.string().meta({className: 'crypto-address'}).required()
    .description('(audience) destination of the transaction'),

  amt: joi.string().meta({className: 'math-big-number(+)'}).required()
    .description('(amount) number of units to offset on clearing'),
  cru: joi.string().meta({className: 'crypto-unit-of-account'}).required()
    .description('(unit) cryptographic unit of account identifier'),
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
