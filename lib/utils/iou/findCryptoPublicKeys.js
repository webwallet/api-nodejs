'use strict'

/* Retrieve the public keys that are not embedded in the signature objects */
async function findCryptoPublicKeys(inputs, wallets) {
  let signers = new Set()

  /* Add available public keys to the corresponding addresses */
  for (let input of inputs) {
    for (let signature of input.sigs) {
      let address = signature.wid
      if (signers.has(address)) continue

      let {alg, key, kid} = signature
      wallets.get(address).publicKey = {alg, key, kid}
      signers.add(address)
    }
  }

  /* Find the public key(s) for each signer, if applicable */
  let promises = Array.from(signers.keys()).map(address => {
    let signer = wallets.get(address)

    if (!signer.publicKey) {
      return Promise.resolve(/*find public keys*/signer)
    }

    return signer
  })

  await Promise.all(promises)

  return signers
}

module.exports = findCryptoPublicKeys
