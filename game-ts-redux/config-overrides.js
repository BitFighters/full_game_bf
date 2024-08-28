const path = require('path')

module.exports = function override(config, env) {
  // Add or modify webpack configuration here
  config.resolve.fallback = {
    assert: require.resolve('assert'),
    os: require.resolve('os-browserify/browser'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    url: require.resolve('url/'),
  }

  return config
}
