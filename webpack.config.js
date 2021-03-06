const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './public',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    plugins: [
        new webpack.ProvidePlugin({
          PIXI: 'pixi.js'
        })
      ]
};