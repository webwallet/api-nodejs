'use strict'

const port = process.env.PORT || 3000

const Microapi = require('../../microapi/koa')
const api = new Microapi()

api.define('./api')
api.listen(port)

module.exports = api
