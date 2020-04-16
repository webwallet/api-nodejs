'use strict'

async function storeTransactionRecord({database}, res, next) {
  try {
    let  transaction = res.locals.transaction
    let hashtable = await database.hashtable.create
      .transaction({id: transaction.id, body: transaction.content})
    res.locals.hashtableResult = hashtable
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = storeTransactionRecord
