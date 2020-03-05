'use strict'

async function storeTransactionRecord({database}, res, next) {
  try {
    let  transaction = res.locals.transaction
    let hashtable = await database.hashtable.create
      .transaction({id: transaction.id, body: transaction.content})
    res.locals.hashtableResult = hashtable
    next()
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(400).send(body)
  }
}

module.exports = storeTransactionRecord
