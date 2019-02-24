const merge = require('webpack-merge')
const { InjectManifest } = require('workbox-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new InjectManifest({
      swSrc: './src/service-worker.js',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],
})
