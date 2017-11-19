var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var path = require('path');
var fs = require('fs');

var nodeModules = {};

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  externals: nodeModules,
  plugins: [
    new UglifyJsPlugin({
      include: /js$/,
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })
  ],
  devtool: 'sourcemap'
}