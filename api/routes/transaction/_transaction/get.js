'use strict'

const utils = require('@lib/utils')

async function handler({ params, database }, res) {
  try {

    let { id, body: transaction } = await utils.transaction
      .getTransactionByHash({hash: params.transaction, database})

    let status = !!id ? 200 : 404 /* IOU not found */

    res.status(status).send(transaction)

  } catch(error) {
    error.status = 404
    next(error)
  }
}


module.exports = handler
