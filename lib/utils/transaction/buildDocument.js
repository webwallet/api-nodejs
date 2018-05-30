'use strict'

const crypto = require('crypto')
const stringify = require('json-stable-stringify')

const validateDocument = require('./validateDocument')
const convertMapToArray = require('../convertMapToArray')
const createHash = require('@webwallet/cryptools').hashing.create

class TransactionDocument {
  constructor({hash = {}, data = {}, sigs = []} = {}, params = {}) {
    let {inputs = [], outputs = []} = data
    outputs = outputs instanceof Array ? outputs : convertMapToArray(outputs)
    this.properties = {
      hash,
      data: {inputs, outputs},
      sigs
    }
    this.parameters = params
  }
  get id() {
    return this.properties.hash.val
  }
  set data(data) {
    this.properties.data = data
    return this.hash()
  }
  get data() {
    return this.properties.data
  }
  update(property, value) {
    this.properties.data[property] = value
    return this.hash()
  }
  validate() {
    return validateDocument.call(this)
  }
  hash({algorithms = 'sha256:sha256'} = {}) {
    let data = stringify(this.data)
    let encodings = ['utf8']

    this.properties.hash.alg = algorithms
    this.properties.hash.typ = 'stringify:data'
    this.properties.hash.val = createHash(data, algorithms, encodings)

    return this
  }
  sign(keys = []) {
    this.properties.sigs = []
    this.parameters.keys = keys
    for (let key of keys) {
      let signature = /*generate signature*/{}
      this.properties.sigs.push(signature)
    }
    // Object.freeze(this.properties)
    return this
  }
  get content() {
    return this.properties
  }
}

function buildDocument(data = {}, params = {}) {
  let document = new TransactionDocument({data}, params)

  return document.hash(params.hash).sign(params.keys)
}

module.exports = buildDocument
