'use strict'

async function storeTransactionRecord({database}, res, next) {
  let  transaction = res.locals.transaction
  let hashtable = await database.hashtable.create
    .transaction({id: transaction.id, body: transaction.content})
  res.locals.hashtableResult = hashtable
  next()
}

module.exports = storeTransactionRecord
