'use strict'

const bignumber = require('*lib/utils/accounting/bignumber')

async function feedPreviousToOutputs(previous, outputs) {
  for (let unspent of previous) {
    let target = unspent.content.adr + '::' + unspent.content.cru
    let output = outputs.get(target)
    output.bal = bignumber.add(output.bal, unspent.content.bal)
  }
}

module.exports = feedPreviousToOutputs
