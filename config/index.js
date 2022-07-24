var config;

if (process.env.NODE_ENV === 'production') {
  config = require('./prod')
} else {
  config = require('./prod')
  // config = require('./dev')
}

module.exports = config