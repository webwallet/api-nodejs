'use strict'

const joi = require('joi')
const config = require('../config.json')
const signatureObject = require('./crypto-signature-object')

const schema = joi.array()
  .items(signatureObject.meta({className: 'crypto-signature-object'}))
  .description('an array of digital signature objects')
  .options({stripUnknown: false})

module.exports = schema
