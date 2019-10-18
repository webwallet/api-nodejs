'use strict'

function buildQueryParameters(transaction) {
  return {
    id: transaction.id,
    inputs: transaction.data.inputs.map(input => input.hash),
    outputs: transaction.data.outputs
  }
}

function buildNewQueryParameters(transaction) {
  let params = {id: transaction.id, countspaces: []}
  let symbols = new Set(transaction.data.outputs.map(output => output.counter))

  symbols.forEach(symbol => params.countspaces.push({
    symbol, inputs: [], outputs: [], sources: []
  }))
  transaction.meta.inputs.forEach(input => {
    let countspace = params.countspaces.find(space => space.symbol === input.data.symbol)
    countspace.inputs.push({hash: input.hash.value})
  })
  transaction.data.outputs.forEach((output, index) => {
    let countspace = params.countspaces.find(space => space.symbol === output.counter)
    countspace.outputs.push({index, address: output.address, sources: output.sources})
    countspace.sources.push(...output.sources)
  })

  return params
}

module.exports = buildNewQueryParameters
