'use strict'

const joi = require('joi')
const config = require('../config.json')
const signatureObject = require('./crypto-signature-object')

const schema = joi.array()
  .items(signatureObject.meta({className: 'crypto-signature-object'}))

module.exports = schema
