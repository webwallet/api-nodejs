'use strict'

module.exports = async function handler({ request, params }) {
  return {body: `get /address/${params.address}/balance`, status: 200}
}
