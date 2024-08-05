const path = require('path-browserify');
const os = require('os-browserify/browser');
const crypto = require('crypto-browserify');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    crypto: require.resolve('crypto-browserify'),
  };
  return config;
};