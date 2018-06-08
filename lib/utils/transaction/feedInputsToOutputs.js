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
  source.bal.net = bignumber.subtract(source.bal.net, amount)
  target.bal.net = bignumber.add(target.bal.net, amount)

  if (bignumber.lessThan(source.bal.net, source.bal.min)) {
    let error = new Error('lower-limit-reached')
    error.details = {address: source.adr}
    throw error
  } else if (bignumber.greaterThan(target.bal.net, target.bal.max)) {
    let error = new Error('upper-limit-reached')
    error.details = {address: target.adr}
    throw error
  }
}

async function allocateCredit({ source, target, credit, symbol }) {
  /* Validate that the source can grant credit */
  if (source.cru === symbol) {
    source.bal.min = bignumber.subtract(source.bal.min, credit)
    target.bal.min = bignumber.add(target.bal.min, credit)
  } else {
    let error = new Error('address-cannot-grant-credit')
    error.details = {address: source.adr}
    throw error
  }
}

module.exports = feedInputsToOutputs
