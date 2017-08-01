'use strict'

function buildOutputObject(params = {}) {
  let output = {
    adr: params.address,
    bal: '0',
    cru: params.countspace,
    lim: null,
    pre: []
  }

  if (output.adr === output.cru) {
    output.lim = {low: '-Infinity', upp: '0'}
  } else {
    output.lim = {low: '0', upp: 'Infinity'}
  }

  return output
}

function buildOutputsMapping(wallets, params = {}) {
  let outputs = new Map()

  for (let address of wallets.keys()) {
    for (let countspace of wallets.get(address).countspaces) {
      let output = buildOutputObject({address, countspace})
      outputs.set(address + '::' + countspace, output)
    }
  }

  return outputs
}

module.exports = buildOutputsMapping
