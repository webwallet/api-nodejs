'use strict'

const bignumber = require('*lib/utils/accounting/bignumber')

async function feedPreviousToOutputs(previous, outputs) {
  for (let unspent of previous) {
    let target = unspent.content.adr + '::' + unspent.content.cru
    let output = outputs.get(target)
    if (!output) throw new Error('missing-target-output')
    /* If the output can be spent, then... */
    if (mergeableOutputs(unspent.content, output)) {
      output.bal.net = bignumber.add(output.bal.net, unspent.content.bal.net)
      output.pre.push(unspent.pointer)
    }
  }
}

/** Determines whether a previous output can be merged with the current output
 * @returns boolean
 */
async function mergeableOutputs(unspent, current) {
  let output = Object.assign({}, current)

  /* Account for (-)Infinity values in balance limits */
  if (output.bal.min === '-Infinity') {
    output.bal.min = bignumber.max(unspent.bal.min, output.bal.min)
  } else {
    output.bal.min = bignumber.add(unspent.bal.min, output.bal.min)
  }
  if (output.bal.max === 'Infinity') {
    output.bal.max = bignumber.min(unspent.bal.max, output.bal.max)
  } else {
    output.bal.max = bignumber.add(unspent.bal.max, output.bal.max)
  }
  /* Check compatibility of time constraints */

  current = output
  return true
}

module.exports = feedPreviousToOutputs
