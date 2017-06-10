'use strict'

const BigNumber = require('bignumber.js')

function add(...operands) {
  return operands.map(operand => new BigNumber(operand))
    .reduce((result, operand) => {
      return result.plus(operand)
    }, (new BigNumber(0)))
    .toFixed()
}

function subtract(from, ...operands) {
  return operands.map(operand => new BigNumber(operand))
    .reduce((result, operand) => {
      return result.minus(operand)
    }, new BigNumber(from))
    .toFixed()
}

function lessThan(lower, greater) {
  return (new BigNumber(lower)).lessThan(new BigNumber(greater));
}

function greaterThan(lower, greater) {
  return (new BigNumber(greater)).greaterThan(new BigNumber(lower));
}

module.exports = {
  add,
  subtract,
  lessThan,
  greaterThan
}
