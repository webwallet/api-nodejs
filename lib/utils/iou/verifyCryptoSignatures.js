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

/* Verify that all required signatures are present and valid */
async function verifyCryptoSignatures(inputs, wallets) {
  let verifications = new Map()

  for (let input of inputs) {
    /* 1. Initialize the (number of) required, available and compliant signatures */
    let verification = inputVerifications(input)
    verifications.set(input.hash.val, verification)
    /* 2. Verify all available signatures */
    for (let signature of input.sigs) {
      let address = signature.wid
      let wallet = wallets.get(address)
      if (wallet) {
        verification.available[address] += 1
        if (wallet.publicKey) {
          /* verify that the available signature is compliant */
          let params = verificationParams(input, wallet, signature)
          verification.compliant[address] += verify(params) ? 1 : 0
        } else if (wallet.publicKeys) {
          /* parse keys, threshold, etc */
        } else {/* problem */}
      } else {
        /* the provided signature does not belong to any of the involved addresses */
      }
    }
    /* 3. Decide whether the input meets the signature requirements */
    let required = reduceVerifications(verification.required)
    let available = reduceVerifications(verification.available)
    let compliant = reduceVerifications(verification.compliant)

    verification.result = (required === compliant)
  }

  /* Consolidate signature requirements verifications */
  let result = Array.from(verifications.values())
    .map(verification => verification.result)
    .reduce((a, b) => a && b)

  if (!result) {
    let exception = new Error('signature-verification-failed')
    exception.details = Array.from(verifications.entries())
      .map(([id, info]) => ({id, info}))
    throw exception
  }

  return {
    result,
    values: verifications
  }
}

/* Aggregate the number of successfull verifications in one single numberic value */
function reduceVerifications(verification = {}) {
  return Object.values(verification).reduce((a, b) => a + b)
}

function inputVerifications(input) {
  let verification = {required: {}, available: {}, compliant: {}}

  verification.required[input.data.sub] = 1 // depends on multisig
  verification.available[input.data.sub] = 0
  verification.compliant[input.data.sub] = 0

  return verification
}

/* Build a parameters object for the cryptographic signature verification */
function verificationParams(input, wallet, signature) {
  return {
    message: input.hash.val,
    signature: signature.sig,
    algorithm: signature.alg,
    publicKey: wallet.publicKey.key
  }
}

/* Verify a cryptographic signature on a message according to its algorithm */
function verify({message, signature, algorithm, publicKey, encoding}) {
  let scheme = schemes[algorithm]
  if (!scheme) return false

  return scheme.verify(message, signature, publicKey, encoding)
}

module.exports = verifyCryptoSignatures
