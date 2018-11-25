// Production ready webpack build
// run using 'webpack --config webpack.production.config.js'

const webpack = require('webpack');
const _ = require('lodash');
const config = _.cloneDeep(require('./webpack.config'));

config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
config.plugins.push(new webpack.optimize.DedupePlugin());
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
}));

delete config.devServer;
delete config.devtool;

module.exports = config;
