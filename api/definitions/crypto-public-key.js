'use strict'

const joi = require('joi')
const config = require('../config.json')
const {min, max} = config.lengths.crypto.publicKey

const schema = joi.string().hex().min(min).max(max)
  .description('cryptographic public key in hex format')

module.exports = schema
