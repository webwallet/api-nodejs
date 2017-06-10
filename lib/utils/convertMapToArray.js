'use strict'

function convertMapToArray(map) {
  let array = []

  for (let [key, entry] of map.entries()) {
    array.push(entry)
  }

  return array
}

module.exports = convertMapToArray
