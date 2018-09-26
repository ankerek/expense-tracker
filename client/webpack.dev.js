const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/graphql': {
        target: `http://localhost:${process.env.API_PORT || 3000}/graphql`,
        secure: false,
      },
    },
  },
})
