'use strict'

function buildOutputObject(params = {}) {
  let output = {
    adr: params.address,
    bal: {net: '0'},
    cru: params.countspace,
    pre: []
  }

  if (output.adr === output.cru) {
    output.bal.min = '-Infinity'
    output.bal.max = '0'
  } else {
    output.bal.min = '0'
    output.bal.max = 'Infinity'
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
