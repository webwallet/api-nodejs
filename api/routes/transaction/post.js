'use strict'

const utils = require('*lib/utils')

module.exports = async function handler({ request, params, database }) {
  let data = request.body.data
  /* 1. Extract wallet properties from input sources and targets */
  let wallets = utils.iou.parseWalletProperties(data.inputs)
  /* 2. Get public keys for signature verification, if applicable */
  /* 3. Verify digital signatures of all IOUs */

  /* 4. Get unspent transaction outputs */
  let pointers = await utils.transaction
    .getUnspentPointers({wallets, database, inputs: data.inputs})
  pointers.map(({address, pointers}) => wallets.get(address).pointers = pointers)

  let contents = await utils.transaction.getOutputContents({wallets, database})
  contents.map(({pointer, content}) => {
    if (content.adr) wallets.get(content.adr).pointers.set(pointer, content)
  })

  /* 5. Compute new outputs */
  /* 6. Build transaction document */

  /* 7. Send graphstore clearing query */
  /* 8. Run post-query validations */
  /* 9. commit / rollback */

  return {body: 'post /transaction', status: 200}
}
