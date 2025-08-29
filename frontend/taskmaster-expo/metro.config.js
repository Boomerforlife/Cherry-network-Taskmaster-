const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro uses the correct project root
config.projectRoot = __dirname;
config.watchFolders = [__dirname];

// Add resolver configuration
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = config; 