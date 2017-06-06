'use strict'

const bignumber = require('*lib/utils/accounting/bignumber')

async function feedInputsToOutputs(inputs, outputs) {
  for (let input of inputs) {
    let amount = input.data.amt
    let symbol = input.data.cru

    let source = outputs.get(input.data.sub + '::' + symbol)
    let target = outputs.get(input.data.aud + '::' + symbol)

    source.bal = bignumber.subtract(source.bal, amount)
    target.bal = bignumber.add(target.bal, amount)
  }
}

module.exports = feedInputsToOutputs
