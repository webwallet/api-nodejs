'use strict'

function buildOutputObject(output = {}, params = {}) {
  return Object.assign({
    adr: output.address,
    bal: output.balance || '0',
    cru: output.countspace,
    lim: output.limits || {},
    pre: output.previous || []
  }, params)
}

function buildOutputsArray(wallets, params = {}) {
  let outputs = []

  for (let address of wallets.keys()) {
    outputs.push(...wallets.get(address).countspaces.map(countspace => {
      return buildOutputObject({address, countspace}, params[address])
    }))
  }

  return outputs
}

module.exports = buildOutputsArray
