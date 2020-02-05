'use strict'

const stringify = require('json-stable-stringify')

async function getTransactionByHash({ hash, database }) {
  let records = await database.hashtable
    .read.transaction.record({id: hash})

  return records[0]
}

module.exports = getTransactionByHash
