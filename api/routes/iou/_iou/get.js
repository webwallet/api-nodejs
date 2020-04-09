'use strict'

const utils = require('@lib/utils')

async function handler({ params, database }, res) {
  try {
    let { iou, transaction } = await utils.iou
      .getIouByHash({hash: params.iou, database})
    
    let status = !!iou ? 200 : 404 /* IOU not found */

    res.status(status).send({data: {iou, transaction}})
  } catch (error) {
    next(error)
  }
}

module.exports = handler
