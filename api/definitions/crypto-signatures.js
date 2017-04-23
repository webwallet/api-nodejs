'use strict'

const joi = require('joi')
const config = require('../config.json')

const signatures = config.items.signatures.array
const algorithms = config.values.crypto.signatures
const maxPublicKeys = config.items.publicKeys.max - 1
const {min: sigMin, max: sigMax} = config.lengths.crypto.signature

const items = joi.object().keys({
  alg: joi.string().valid(algorithms).required()
    .description('digital signature algorithm'),
  wid: joi.string().meta({className: 'crypto-address'}).required()
    .description('cryptographic address of the signer'),
  key: joi.string().meta({className: 'crypto-public-key'})
    .description('public key for signature verification'),
  kid: joi.number().integer().min(0).max(maxPublicKeys)
    .description('index of an array of public keys'),
  sig: joi.string().hex().min(sigMin).max(sigMax).required()
    .description('DER encoded digital signature')
})

const schema = joi.array().items(items)
  .min(signatures.min).max(signatures.max).unique()
  .description('an array of digital signature objects')
  .options({stripUnknown: false})

module.exports = schema
