// production config
const merge = require('webpack-merge');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const getConfig = require('./getConfig');
const constants = require('./constants');

module.exports = merge(getConfig(), {
  mode: 'production',
  entry: ['./index.tsx'],
  output: {
    path: resolve(__dirname, '../dist'),
    filename: `${constants.assets_folder_name}/[name].[hash].js`,
    chunkFilename: `${constants.assets_folder_name}/[name].[chunkhash].js`,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 5,
      automaticNameDelimiter: '-',
      cacheGroups: {
        '@ant-design': {
          name: '@ant-design',
          test: (module) => {
              return /@ant-design/.test(module.context);
          },
          chunks: 'initial',
          priority: 11,
        },
        'tezign-ui': {
          name: 'tezign-ui',
          test: (module) => {
              return /tezign-ui|antd|rc-/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 5
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          priority: 2,
          minChunks: 2,
        },
      }
    },
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        cache: true,
        parallel: true,
        // sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          extractComments: 'all',
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${constants.assets_folder_name}/[name].[contenthash].css`,
      chunkFilename: `${constants.assets_folder_name}/[name].[contenthash].css`
    })
    // if you need 
    // ,new BundleAnalyzerPlugin()
  ]
});
