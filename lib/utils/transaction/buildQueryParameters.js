'use strict'

function buildQueryParameters(transaction) {
  return {
    id: transaction.id,
    inputs: transaction.data.inputs.map(input => input.hash),
    outputs: transaction.data.outputs
  }
}

module.exports = buildQueryParameters
