'use strict'

const delimiter = '::'

function buildOutputObject(params = {}) {
  let output = {
    address: params.address,
    balance: {net: '0'},
    counter: params.counter,
    sources: []
  }

  if (output.address === output.counter) {
    output.balance.min = '-Infinity'
    output.balance.max = '0'
  } else {
    output.balance.min = '0'
    output.balance.max = 'Infinity'
  }

  return output
}

function buildOutputsMapping(wallets, params = {}) {
  let outputs = new Map()

  for (let address of wallets.keys()) {
    for (let countspace of wallets.get(address).countspaces) {
      let output = buildOutputObject({address, counter: countspace})
      outputs.set(address + delimiter + countspace, output)
    }
  }

  return outputs
}

module.exports = buildOutputsMapping
