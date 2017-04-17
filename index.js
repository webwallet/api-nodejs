'use strict'

const [,, port = 3000] = process.argv

const Microapi = require('../../microapi/koa')
const api = new Microapi()

api.define('./api')
api.listen(port)

module.exports = api
