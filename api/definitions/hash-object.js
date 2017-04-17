'use strict'

const joi = require('joi')
const config = require('../config.json')
const {hashes, inputs} = config.values.crypto
const {min, max} = config.lengths.crypto.hashes

const schema = joi.object().keys({
  alg: joi.string().valid(hashes).default(hashes[0]).required()
    .description('cryptographic hash algorithm'),
  typ: joi.string().valid(inputs).default(inputs[0])
    .description('instructions for hash generation'),
  val: joi.string().hex().trim().min(min).max(max).required()
    .description('cryptographic hash value')
})

module.exports = schema
