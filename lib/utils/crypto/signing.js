'use strict'

const elliptic = require('elliptic')
const ed25519 = new elliptic.ec('ed25519')

const schemes = {
  ed25519: {
    verify: (hash, signature, publicKey, encoding = 'hex') => {
      return ed25519.verify(hash, signature, publicKey, encoding)
    }
  }
}

class Signature {
  static verify({message, signature, algorithm, publicKey, encoding}) {
    let scheme = schemes[algorithm]
    if (!scheme) return false

    return scheme.verify(message, signature, publicKey, encoding)
  }
}

module.exports = Signature
