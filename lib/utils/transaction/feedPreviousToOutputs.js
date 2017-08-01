'use strict'

const bignumber = require('*lib/utils/accounting/bignumber')

async function feedPreviousToOutputs(previous, outputs) {
  for (let unspent of previous) {
    let target = unspent.content.adr + '::' + unspent.content.cru
    let output = outputs.get(target)
    if (!output) throw new Error('missing-target-output')
    /* If the output can be spent, then... */
    if (mergeableOutputs(unspent.content, output)) {
      output.bal = bignumber.add(output.bal, unspent.content.bal)
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
  if (output.lim.low === '-Infinity') {
    output.lim.low = bignumber.max(unspent.lim.low, output.lim.low)
  } else {
    output.lim.low = bignumber.add(unspent.lim.low, output.lim.low)
  }
  if (output.lim.upp === 'Infinity') {
    output.lim.upp = bignumber.min(unspent.lim.upp, output.lim.upp)
  } else {
    output.lim.upp = bignumber.add(unspent.lim.upp, output.lim.upp)
  }
  /* Check compatibility of time constraints */

  current = output
  return true
}

module.exports = feedPreviousToOutputs
