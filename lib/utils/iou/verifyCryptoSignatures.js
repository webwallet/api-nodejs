'use strict'

const cryptools = require('@webwallet/cryptools')

const createHash = cryptools.hashing.create
const verifySignature = cryptools.signing.verify

/* Verify that all required signatures are present and valid */
async function verifyCryptoSignatures(inputs, wallets) {
  let verifications = new Map()

  for (let input of inputs) {
    /* 1. Initialize the (number of) required, available and compliant signatures */
    let verification = inputVerifications(input)
    verifications.set(input.hash.value, verification)
    /* 2. Verify all available signatures */
    for (let signature of input.meta.signatures) {
      let address = signature.signer
      let wallet = wallets.get(address)
      if (wallet) {
        verification.available[address] += 1
        if (wallet.signing.key) {
          /* verify that the available signature is compliant */
          let params = verificationParams(input, wallet, signature)
          verification.compliant[address] += verifySignature(params) ? 1 : 0
        } else if (wallet.signing.puzzle) {
          /* parse keys, threshold, etc */
        } else {
          /* no public keys found to verify whether the address matches */
          let error = new Error('missing-publickey-or-puzzle')
          error.details = {address}
          throw error
        }

        /* Verify that the provided public keys correspond to the address */
        let correspondence = addressKeysCorrespondence(address, wallet.signing)
        if (!correspondence) {
          let error = new Error('address-publickey-mismatch')
          let {key, puzzle, linker, keypos} = wallet.signing
          error.details = {address, key, linker, keypos}
          throw error
        }
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
  let source = input.data.source

  verification.required[source] = 1 // depends on multisig
  verification.available[source] = 0
  verification.compliant[source] = 0

  return verification
}

/* Build a parameters object for the cryptographic signature verification */
function verificationParams(input, wallet, signature) {
  return {
    scheme: signature.scheme,
    message: input.hash.value,
    signature: signature.string,
    publicKey: wallet.signing.key,
    derivation: signature.linker
  }
}

function addressKeysCorrespondence(address, signing) {
  if (signing.key) {
    let data = signing.key
    let hashing = signing.linker
    let derived = cryptools.puzzles.address.generate({data, hashing})
    return address === derived
  } else if (signing.puzzle) {
    /* verify that the key is listed in the address' hash puzzle */
    return false
  } else {
    /* missing public key properties for correspondence verification */
    return false
  }
}

module.exports = verifyCryptoSignatures
