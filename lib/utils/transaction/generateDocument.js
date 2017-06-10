'use strict'

class TransactionDocument {
  constructor({hash = {}, data = {}, sigs = []} = {}, params = {}) {
    let {inputs = [], outputs = []} = data
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
  hash({type} = {}) {
    this.properties.hash = {val: 'h:' + Math.random()*10}
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

function generateDocument(data = {}, params = {}) {
  let document = new TransactionDocument({data}, params)

  return document.hash(params.hash).sign(params.keys)
}

module.exports = generateDocument
