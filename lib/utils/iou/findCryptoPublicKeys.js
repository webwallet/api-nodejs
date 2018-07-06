'use strict'

/* Retrieve the public keys that are not embedded in the signature objects */
async function findCryptoPublicKeys(inputs, wallets) {
  let signers = new Set()

  /* Add available public keys to the corresponding addresses */
  for (let input of inputs) {
    for (let signature of input.meta.signatures) {
      let address = signature.signer
      let wallet = wallets.get(address)
      if (signers.has(address)) continue
      else if (!wallet) throw new Error('invalid-signer-address')

      let {public: key, scheme, linker, keypos} = signature
      wallet.signing = {key, scheme, linker, keypos}
      signers.add(address)
    }
  }

  /* Find the public key(s) for each signer, if applicable */
  let promises = Array.from(signers.keys()).map(address => {
    let wallet = wallets.get(address)

    if (wallet.signing.key) {
      return wallet
    } else {
      return Promise.resolve(/*find public keys*/wallet)
    }
  })

  await Promise.all(promises)

  return signers
}

module.exports = findCryptoPublicKeys
