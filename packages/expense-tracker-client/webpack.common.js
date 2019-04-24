const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const srcPath = subdir => path.join(__dirname, 'src', subdir)

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
})

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.join(__dirname, 'dist', 'static'),
    publicPath: '/static/',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    alias: {
      '@pages': srcPath('pages'),
      '@components': srcPath('components'),
      '@modules': srcPath('modules'),
      '@apollo': srcPath('apollo'),
      '@utils': srcPath('utils'),
      '@assets': srcPath('assets'),
    },
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [/node_modules/],
      },

      // fixes https://github.com/graphql/graphql-js/issues/1272
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },

      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        loader: 'file-loader',
      },
    ],
  },

  plugins: [htmlPlugin],
}
