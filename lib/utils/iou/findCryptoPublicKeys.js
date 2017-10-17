'use strict'

/* Retrieve the public keys that are not embedded in the signature objects */
async function findCryptoPublicKeys(inputs, wallets) {
  let signers = new Set()

  /* Add available public keys to the corresponding addresses */
  for (let input of inputs) {
    for (let signature of input.sigs) {
      let address = signature.wid
      let wallet = wallets.get(address)
      if (signers.has(address)) continue
      else if (!wallet) throw new Error('invalid-signer-address')

      let {alg: algorithm, wdf: derivation, key, kid: index} = signature
      wallet.signing = {key, algorithm, derivation, index}
      signers.add(address)
    }
  }

  /* Find the public key(s) for each signer, if applicable */
  let promises = Array.from(signers.keys()).map(address => {
    let signer = wallets.get(address)

    if (signer.signing.key) {
      return signer
    } else {
      return Promise.resolve(/*find public keys*/signer)
    }
  })

  await Promise.all(promises)

  return signers
}

module.exports = findCryptoPublicKeys
