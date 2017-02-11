var path = require('path');

module.exports = {
  entry: {
    'index': "./src/index.js"
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: "java-class-tools.js",
    library: ['JavaClassTools']
  },
  node: {
    fs: "empty",
    process: false
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