'use strict'

const utils = require('*lib/utils')

module.exports = async function handler({ request, params, database }) {
  let wallets = new Map()
  wallets.set(params.address, {countspaces: [request.query.unit]})

  /* Get unspent transaction outputs in the given counstpaces */
  let pointers = await utils.transaction.getUnspentPointers({wallets, database})
  pointers.map(({address, pointers}) => wallets.get(address).pointers = pointers)
  let contents = await utils.transaction.getOutputContents({wallets, database})
  contents.map(({pointer, content}) => {
    if (content.adr) wallets.get(content.adr).pointers.set(pointer, content)
  })

  /* Convert the address and pointer maps to an array of outputs */
  let outputs = []
  for (let [address, {pointers}] of wallets.entries()) {
    for (let [pointer, content] of pointers.entries()) {
      outputs.push({address, pointer, content})
    }
  }

  return {body: {data: {outputs}}, status: 200}
}
