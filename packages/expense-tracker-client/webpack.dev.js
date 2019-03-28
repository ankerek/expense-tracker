const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 9000,
    historyApiFallback: {
      index: '/static/index.html',
    },
    proxy: {
      '/graphql': {
        target: `http://localhost:${process.env.PORT || 3000}/graphql`,
        secure: false,
      },
    },
  },
})
