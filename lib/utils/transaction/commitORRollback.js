'use strict'

/* Commit or rollback a database transaction according to its validation result */
async function commitORRollback(validation, transaction) {
  if (validation.success) {
    transaction.commit()
  } else {
    transaction.rollback()
    throw new Error('transaction-not-committed')
  }
}

module.exports = commitORRollback
