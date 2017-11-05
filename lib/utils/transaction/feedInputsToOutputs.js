'use strict'

const bignumber = require('*lib/utils/accounting/bignumber')

async function feedInputsToOutputs(inputs, outputs) {
  for (let input of inputs) {
    let amount = input.data.amt
    let credit = input.data.alw
    let symbol = input.data.cru
    /* Match address outputs by currency symbol */
    let source = outputs.get(`${input.data.sub}::${symbol}`)
    let target = outputs.get(`${input.data.aud}::${symbol}`)

    if (amount) await clearBalances({source, target, amount})
    if (credit) await allocateCredit({source, target, credit, symbol})
  }
}

async function clearBalances({ source, target, amount }) {
  source.bal = bignumber.subtract(source.bal, amount)
  target.bal = bignumber.add(target.bal, amount)

  if (bignumber.lessThan(source.bal, source.lim.low)) {
    let error = new Error('lower-limit-reached')
    error.details = {address: source.adr}
    throw error
  } else if (bignumber.greaterThan(target.bal, target.lim.upp)) {
    let error = new Error('upper-limit-reached')
    error.details = {address: target.adr}
    throw error
  }
}

async function allocateCredit({ source, target, credit, symbol }) {
  /* Validate that the source can grant credit */
  if (source.cru === symbol) {
    source.lim.low = bignumber.subtract(source.lim.low, credit)
    target.lim.low = bignumber.add(target.lim.low, credit)
  } else {
    let error = new Error('address-cannot-grant-credit')
    error.details = {address: source.adr}
    throw error
  }
}

module.exports = feedInputsToOutputs
