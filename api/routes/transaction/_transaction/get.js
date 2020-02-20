'use strict'

const utils = require('@lib/utils')

async function handler({ params, database }, res) {
  try {

    let { id, body: transaction } = await utils.transaction
      .getTransactionByHash({hash: params.transaction, database})

    let status = !!id ? 200 : 404 /* IOU not found */

    res.status(status).send(transaction)

  } catch(exeption) {
    let { message, details } = exception
    let body = {error: {message, details}}
    let status

    switch (exception.message) {
    default:
      status = 404
      break
    }

    res.status(status).send(body)
  }
}


module.exports = handler
