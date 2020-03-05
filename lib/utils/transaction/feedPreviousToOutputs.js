'use strict'

const bignumber = require('@lib/utils/accounting/bignumber')

const delimiter = '::'

async function feedPreviousToOutputs(req, res, next) {
  try {
    let previous = res.locals.outputs
    let outputs = res.locals.newoutputs
    for (let unspent of previous) {
      let target = unspent.content.address + delimiter + unspent.content.counter
      let output = outputs.get(target)
      if (!output) throw new Error('missing-target-output')
      /* If the output can be spent, then... */
      if (mergeableOutputs(unspent.content, output)) {
        output.balance.net = bignumber
          .add(output.balance.net, unspent.content.balance.net)
        output.sources.push(unspent.pointer)
      }
    }
    next()
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}

/** Determines whether a previous output can be merged with the current output
 * @returns boolean
 */
async function mergeableOutputs(unspent, current) {
  let output = Object.assign({}, current)

  /* Account for (-)Infinity values in balance limits */
  if (output.balance.min === '-Infinity') {
    output.balance.min = bignumber
      .max(unspent.balance.min, output.balance.min).toString()
  } else {
    output.balance.min = bignumber
      .add(unspent.balance.min, output.balance.min).toString()
  }
  if (output.balance.max === 'Infinity') {
    output.balance.max = bignumber
      .min(unspent.balance.max, output.balance.max).toString()
  } else {
    output.balance.max = bignumber
      .add(unspent.balance.max, output.balance.max).toString()
  }
  /* Check compatibility of time constraints */

  current = output
  return true
}

module.exports = feedPreviousToOutputs
