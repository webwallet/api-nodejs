'use strict'

const crypto = require('crypto')
const stringify = require('json-stable-stringify')

const validateDocument = require('./validateDocument')
const convertMapToArray = require('../convertMapToArray')
const createHash = require('@webwallet/cryptools').hashing.create

class TransactionDocument {
  constructor({hash = {}, data = {}, meta = {}} = {}, params = {}) {
    let {inputs = [], outputs = []} = data
    let inputHashes = inputs.map(input => ({hash: input.hash.value}))
    outputs = outputs instanceof Array ? outputs : convertMapToArray(outputs)

    this.properties = {
      hash,
      data: {inputs: inputHashes, outputs},
      meta
    }
    this.properties.meta.inputs = inputs
    this.parameters = params
  }
  get id() {
    return this.properties.hash.value
  }
  set data(data) {
    this.properties.data = data
    return this.hash()
  }
  get data() {
    return this.properties.data
  }
  get meta() {
    return this.properties.meta
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

    this.properties.hash.types = algorithms
    this.properties.hash.steps = 'stringify:data'
    this.properties.hash.value = createHash({data, algorithms, encodings})

    return this
  }
  sign(keys = []) {
    this.properties.meta.signatures = []
    this.parameters.keys = keys
    for (let key of keys) {
      let signature = /*generate signature*/{}
      this.properties.meta.signatures.push(signature)
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