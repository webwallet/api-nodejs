'use strict'

const joi = require('joi')
const config = require('../config.json')
const signatureObject = require('./signature-object')

const schema = joi.array()
  .items(signatureObject.meta({className: 'signature-object'}))

module.exports = schema
