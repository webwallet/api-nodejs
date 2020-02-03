'use strict'

const utils = require('@lib/utils')

async function handler({ params, database }) {
  let { id, body: transaction } = await utils.transaction
    .getTransactionByHash({hash: params.transaction, database})

  let status = !!id ? 200 : 404 /* IOU not found */

  return {body: transaction, status}
}

handler.exceptions = async function exceptions(context, exception) {
  let { message, details } = exception
  let body = {error: {message, details}}
  let status

  switch (exception.message) {
  default:
    status = 404
    break
  }

  return {body, status}
}

module.exports = handler
