const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const { InjectManifest, GenerateSW } = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    // new InjectManifest({
    //   swSrc: './src/service-worker.js',
    // }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/static/index.html',
      navigateFallbackBlacklist: [/^\/static/, /^\/robots.txt/],
    }),
    new WebpackPwaManifest({
      name: 'Expense tracker 2049',
      short_name: 'Tracker',
      start_url: '/',
      background_color: '#2196f3',
      display: 'standalone',
      theme_color: '#2196f3',
      inject: true,
      ios: true,
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          ios: true,
        },
      ],
    }),
    new CopyPlugin([{ from: 'src/static', to: path.join(__dirname, 'dist') }]),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    new webpack.DefinePlugin({
      'process.env.COMMIT': JSON.stringify(process.env.SOURCE_VERSION),
    }),
  ],
})
