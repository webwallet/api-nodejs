'use strict'

/** Extract the addresses and their properties listed in the provided IOUs **/
function parseWalletProperties(ious = []) {
  /* Create a map of address keys and Set() values with their countspaces */
  let map = new Map()
  for (let iou of ious) {
    /* Map<Address, Set(Countspaces)> */
    mapSet(map, iou.data.sub, iou.data.cru) // source (subject)
    mapSet(map, iou.data.aud, iou.data.cru) // target (audience)
  }

  /* Create an array of address/counstpaces from the map and its sets */
  let addresses = new Map()
  for (let address of map.keys()) {
    let countspaces = []
    for (let countspace of map.get(address).keys()) {
      countspaces.push(countspace)
    }
    addresses.set(address, {countspaces})
  }

  return addresses
}

/* Map<Key, Set()> */
function mapSet(map, key, element) {
  return (map.get(key) || map.set(key, new Set()).get(key)).add(element)
}

module.exports = parseWalletProperties
