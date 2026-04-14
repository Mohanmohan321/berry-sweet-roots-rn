const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Enable PDF bundling as a static asset
config.resolver.assetExts.push('pdf');
module.exports = config;
