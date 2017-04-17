'use strict'

module.exports = async function handler({ request, params }) {
  return {body: `get /currency/${params.currency}/supply`, status: 200}
}
