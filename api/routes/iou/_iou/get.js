'use strict'

const utils = require('@lib/utils')

async function handler({ params, database }) {
  let { iou, transaction } = await utils.iou
    .getIouByHash({hash: params.iou, database})
  
  let status = !!iou ? 200 : 404 /* IOU not found */

  return {body: {data: {iou, transaction}}, status}
}

module.exports = handler
