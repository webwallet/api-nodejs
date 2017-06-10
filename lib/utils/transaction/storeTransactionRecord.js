'use strict'

async function storeTransactionRecord({ transaction, database }) {
  return await database.hashtable.create
    .transaction({id: transaction.id, doc: transaction.content})
}

module.exports = storeTransactionRecord
