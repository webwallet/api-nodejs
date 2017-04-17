'use strict'

const fs = require('fs')
const path = require('path')
const [,, lib = 'lib'] = process.argv

let target = path.resolve(__dirname, '../', lib)
let symlink = path.resolve(__dirname, '../', 'node_modules', '*' + lib)

try {
  fs.mkdirSync(`${__dirname}\/..\/node_modules`)
} catch (error) {
  if (error.code !== 'EEXIST') throw error
} finally {
  fs.symlinkSync(target, symlink)
}
