'use strict'

function buildQueryParameters(transaction) {
  return {
    id: transaction.id,
    inputs: transaction.data.inputs.map(input => input.hash.val),
    outputs: mapOutputProperties(transaction.data.outputs)
  }
}

function mapOutputProperties(outputs) {
  return outputs.map(output => {
    return {
      address: output.adr,
      countspace: output.cru,
      previous: output.pre
    }
  })
}

module.exports = buildQueryParameters
