'use strict'

/** Extract the addresses and their properties listed in the provided IOUs **/
function parseWalletProperties(ious = []) {
  /* Create maps for addresses and countspaces to nest related properties */
  let addresses = new Map()
  let countspaces = new Map()

  for (let iou of ious) {
    /* Map<Address, Set(Countspaces)> */
    mapSet(addresses, iou.data.source, iou.data.symbol)
    mapSet(addresses, iou.data.target, iou.data.symbol)
    mapSet(countspaces, iou.data.symbol, iou.data.source)
    mapSet(countspaces, iou.data.symbol, iou.data.target)
  }

  /* Create an array of address/counstpaces from the map and its sets */
  let wallets = new Map()
  for (let address of addresses.keys()) {
    wallets.set(address, {countspaces: Array.from(addresses.get(address).keys())})
  }

  /* Convert 'countspaces' from Map to Array of {symbol, addresses} objects */
  countspaces = Array.from(countspaces.entries())
    .map(([symbol, addresses]) => ({symbol, addresses}))

  return {wallets, countspaces}
}

/* Map<Key, Set()> */
function mapSet(map, key, element) {
  return (map.get(key) || map.set(key, new Set()).get(key)).add(element)
}

module.exports = parseWalletProperties
