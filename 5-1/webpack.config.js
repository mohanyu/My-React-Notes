// var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
    // context: path.join(__dirname),
    context: __dirname + '/src',
    // devtool: debug ? "inline-sourcemap" : null,
    entry: "./js/index.js",
    module: {
        rules: [    //loader改为rules
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    output: {
        path: __dirname + '/src/',
        filename: "./bundle.js"
    },
    // plugins: debug ? [] : [
    //     new webpack.optimize.DedupePlugin(),
    //     new webpack.optimize.OccurenceOrderPlugin(),
    //     new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    // ],
};
