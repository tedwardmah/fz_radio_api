'use strict'

// QA specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/fz_radio_api-qa'
  },

  // Morgan (logging)
  morgan: {
    format: 'combined',
    logDirectory: '/var/log/fz_radio_api-qa'
  }
}