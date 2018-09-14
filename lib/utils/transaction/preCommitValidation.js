'use strict'

async function preCommitValidation(transaction, records) {
  /* Create a Set of IOUs and a Map of address:counter keys for quick access */
  let actualInputs = new Set()
  let actualOutputs = new Map()
  for (let record of records) {
    for (let input of record.inputs) {actualInputs.add(input)}
    for (let output of record.outputs) {
      actualOutputs.set(colonKey(output.address, output.counter), output)
    }
  }

  let validation = {}
  let inputs = await inputsValidation(transaction, actualInputs)
  let outputs = await outputsValidation(transaction, actualOutputs)
  validation.success = inputs.success && outputs.success

  if (validation.success) {
    validation.response = transaction.content
  } else {
    validation.response = validation.message
  }

  return validation
}

async function inputsValidation(transaction, actualInputs) {
  /* Check the actual inputs against the desired inputs */
  let inputsCleared = 0
  let transactionInputs = transaction.data.inputs.map(input => input.hash)
  for (let input of transactionInputs) {
    if (actualInputs.has(input)) inputsCleared++
  }

  let validation = {
    success: (transactionInputs.length === inputsCleared)
  }

  return validation
}

async function outputsValidation(transaction, actualOutputs) {
  /* Check the actual outputs against the desired outputs */
  let outputsCreated = 0
  for (let output of transaction.data.outputs) {
    let actualOutput = actualOutputs.get(colonKey(output.address, output.counter))
    if (actualOutput) {
      /* Check all previous outputs that should have been spent */
      let previousReferenced = 0
      let previousSet = new Set(actualOutput.sources)
      for (let previous of output.sources) {
        if (previousSet.has(previous)) previousReferenced++
      }
      /* Check whether all outputs match the transaction criteria */
      if (output.sources.length === previousReferenced) outputsCreated++
    }
  }

  actualOutputs.clear()

  let validation = {
    success: (transaction.data.outputs.length === outputsCreated)
  }

  return validation
}

function colonKey(...segments) {
  return segments.join(':')
}

module.exports = preCommitValidation
