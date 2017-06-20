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

function buildOutputsMapping(wallets, params = {}) {
  let outputs = new Map()

  for (let address of wallets.keys()) {
    for (let countspace of wallets.get(address).countspaces) {
      let output = buildOutputObject({address, countspace}, params[address])
      outputs.set(address + '::' + countspace, output)
    }
  }

  return outputs
}

module.exports = buildOutputsMapping
