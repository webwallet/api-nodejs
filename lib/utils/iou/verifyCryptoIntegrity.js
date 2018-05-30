'use strict'

const createHash = require('@webwallet/cryptools').hashing.create
const stringify = require('json-stable-stringify')

/* Verify the cryptographic integrity of all transaction inputs */
async function verifyCryptoIntegrity(inputs, wallets) {
  for (let input of inputs) {
    let {hashee, encodings} = deriveHashingParams(input)
    let hash = createHash(hashee, input.hash.alg, encodings)
    if (input.hash.val !== hash) {
      let error = new Error('transaction-input-hash-mismatch')
      error.details = {hash: {provided: input.hash.val, expected: hash}}
      throw error
    }
  }

  return true
}

/* Determine the value to hash and the required encoding */
function deriveHashingParams(object) {
  let type = object.hash.typ
  let data = object.data
  let encodings = []
  let hashee

  switch (type) {
  case 'stringify:data':
    hashee = stringify(data)
    encodings.push('utf8')
    break
  default:
    hashee = typeof data !== 'string' ? stringify(data) : data
    break
  }

  return {hashee, encodings}
}


module.exports = verifyCryptoIntegrity
