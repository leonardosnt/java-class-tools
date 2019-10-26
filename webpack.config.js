const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './dist/'),
    filename: 'java-class-tools.js',
    libraryTarget: 'umd',
    library: 'JavaClassTools'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  mode: 'none'
};