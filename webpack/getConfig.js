const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const constants = require('./constants')

module.exports = function (debug) {
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
            { loader: 'css-loader', options: { importLoaders: 1 } }
          ]
        },
        {
          test: /\.scss$/,
          loaders: [
            debug ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'sass-loader'
          ]
        },
        {
          test: /\.less$/,
          loaders: [
            debug ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
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
      new HtmlWebpackPlugin({
        template: join(__dirname, '../src/index.html'),
        monitoring: debug ? false : true	
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
