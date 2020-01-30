'use strict'

async function getIouByHash({ hash, database }) {
  let { records } = await database.graphstore
    .query('getIouByHash', {iou: hash})

  let { iou = null, transaction = null } = records[0] || {}

  return {iou, transaction}
}

module.exports = getIouByHash
