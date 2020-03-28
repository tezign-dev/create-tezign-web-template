const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const webpack = require('webpack');

const constants = require('./constants')

module.exports = function (debug = false) {
  return {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
        '@': join(__dirname, '../src')
      }
    },
    context: resolve(__dirname, '../src'),
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            debug ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          loaders: [
            debug ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2 } },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.less$/,
          loaders: [
            debug ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2 } },
            'postcss-loader',
            { loader: 'less-loader', options: { javascriptEnabled: true } }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
            `file-loader?hash=sha512&digest=hex&name=${constants.assets_folder_name}/images/[hash].[ext]`,
          ]
        }
      ]
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        template: join(__dirname, '../src/index.html'),
        // 添加 标示 来区分 debug or build 模式
        // npm run build 下此值为 false
        debug,
        // 添加环境标示
        __ENV__: process.env.__ENV__
      }),
      new DefinePlugin({
        __ENV__: JSON.stringify(process.env.__ENV__),
      })
    ],
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-router': 'ReactRouter',
      'moment': 'moment'
    },
    performance: {
      hints: false
    }
  }
};
