'use strict'

const createHash = require('@webwallet/cryptools').hashing.create
const stringify = require('json-stable-stringify')

/* Verify the cryptographic integrity of all transaction inputs */
async function verifyCryptoIntegrity(inputs, wallets) {
  for (let input of inputs) {
    let hash = createHash(deriveHashingParams(input))
    if (input.hash.value !== hash) {
      let error = new Error('transaction-input-hash-mismatch')
      error.details = {hash: {provided: input.hash.value, expected: hash}}
      throw error
    }
  }

  return true
}

/* Determine the value to hash and the required encoding */
function deriveHashingParams(object) {
  let steps = object.hash.steps
  let types = object.hash.types
  let data = object.data
  let encodings = []
  let hashee

  switch (steps) {
  case 'stringify:data':
    hashee = stringify(data)
    encodings.push('utf8')
    break
  default:
    hashee = typeof data !== 'string' ? stringify(data) : data
    encodings.push('utf8')
    break
  }

  return {data: hashee, algorithms: types, encodings}
}


module.exports = verifyCryptoIntegrity
