'use strict'

const bignumber = require('@lib/utils/accounting/bignumber')

async function feedInputsToOutputs(req, res, next) {
  try {
    let inputs = req.body.data.inputs
    let outputs = res.locals.newoutputs
    for (let input of inputs) {
      let {amount, credit, symbol} = input.data
      /* Match address outputs by currency symbol */
      let source = outputs.get(`${input.data.source}::${symbol}`)
      let target = outputs.get(`${input.data.target}::${symbol}`)

      if (amount) await clearBalances({source, target, amount}, input)
      if (credit) await allocateCredit({source, target, credit, symbol}, input)
    }
    next()
  } catch (error) {
    next(error)
  }
}

async function clearBalances({ source, target, amount }, input) {
  try {
    source.balance.net = bignumber.subtract(source.balance.net, amount)
    target.balance.net = bignumber.add(target.balance.net, amount)

    if (bignumber.lessThan(source.balance.net, source.balance.min)) {
      let error = new Error('lower-limit-reached')
      error.details = {address: source.address, input: input.hash.value}
      throw error
    } else if (bignumber.greaterThan(target.balance.net, target.balance.max)) {
      let error = new Error('upper-limit-reached')
      error.details = {address: target.address, input: input.hash.value}
      throw error
    }
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}

async function allocateCredit({ source, target, credit, symbol }, input) {
  try {
    /* Validate that the source can grant credit */
    if (source.counter === symbol) {
      source.balance.min = bignumber.subtract(source.balance.min, credit)
      target.balance.min = bignumber.add(target.balance.min, credit)
    } else {
      let error = new Error('address-cannot-grant-credit')
      error.details = {address: source.address, input: input.hash.value}
      throw error
    }
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}

module.exports = feedInputsToOutputs
