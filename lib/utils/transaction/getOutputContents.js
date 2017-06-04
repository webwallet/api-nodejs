'use strict'

function getOutputContents({ wallets, database}) {
  let addresses = Array.from(wallets.keys())
  let pointers = []

  addresses.map(async address => {
    pointers.push(...wallets.get(address).pointers)
    wallets.get(address).pointers = new Map()
  })

  let requests = pointers.map(async pointer => {
    let [id, index] = pointer.split('::')
    let content = await database.hashtable.read.transaction.outputs({id, index})
    return {pointer, content}
  })

  return Promise.all(requests)
}

module.exports = getOutputContents
