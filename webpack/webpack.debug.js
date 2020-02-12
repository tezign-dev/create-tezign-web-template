// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const { resolve } = require('path');
const getConfig = require('./getConfig');
const constants = require('./constants');

const port = process.env.PORT || constants.port;

module.exports = merge(getConfig(true), {
  mode: 'development',
  entry: [ '../src/index.tsx' ],
  output: {
    path: resolve(__dirname, '../tmp'),
    filename: `${constants.assets_folder_name}/[name].js`,
    chunkFilename: `${constants.assets_folder_name}/[name].js`,
    publicPath: '/'
  },
  devServer: {
    hot: true,
    https: false,
    host: '0.0.0.0',
    port,
    overlay: true,
    compress: true,
    historyApiFallback: true,
    disableHostCheck: true,
    hotOnly: true
  },
  devtool: '#source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin()
  ]
});
