'use strict'

const joi = require('joi')
const config = require('../config.json')
const signatures = config.values.crypto.signatures
const maxPublicKeys = config.items.publicKeys.max - 1
const {min: sigMin, max: sigMax} = config.lengths.crypto.signature

const schema = joi.object().keys({
  alg: joi.string().valid(signatures).required()
    .description('digital signature algorithm'),
  wid: joi.string().meta({className: 'webwallet-address'}).required()
    .description('webwallet address of the signer'),
  key: joi.string().meta({className: 'crypto-public-key'})
    .description('public key for signature verification'),
  kid: joi.number().integer().min(0).max(maxPublicKeys)
    .description('index of an array of public keys'),
  sig: joi.string().hex().min(sigMin).max(sigMax).required()
    .description('digital signature')
})

module.exports = schema
