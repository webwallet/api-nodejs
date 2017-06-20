'use strict'

/* Commit or rollback a database transaction according to its validation result */
async function commirORRollback(validation, transaction) {
  if (validation.success) {
    transaction.commit()
  } else {
    transaction.rollback()
  }
}

module.exports = commirORRollback
