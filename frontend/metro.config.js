// Metro configuration for React Native
// See: https://facebook.github.io/metro/docs/configuration

const { getDefaultConfig } = require('@react-native/metro-config');

/** @type {import('metro-config').ConfigT} */
const config = getDefaultConfig(__dirname);

module.exports = config;

