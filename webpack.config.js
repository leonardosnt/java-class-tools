var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './dist/'),
    filename: 'java-class-tools.js',
    libraryTarget: 'umd',
    library: 'JavaClassTools'
  },
  node: {
    fs: "empty",
    process: "empty"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}