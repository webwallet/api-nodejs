'use strict'

const utils = require('@lib/utils')

async function handler({ params, database }, res) {
  try {
  let { iou, transaction } = await utils.iou
    .getIouByHash({hash: params.iou, database})
  
  let status = !!iou ? 200 : 404 /* IOU not found */

  res.status(status).send({data: {iou, transaction}})
  } catch(exception) {
    const { message } = exception
    const body = { error: { message } }
    res.status(404).send(body)
  }
}

module.exports = handler
