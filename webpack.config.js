var webpack = require('webpack');
var production = process.env.NODE_ENV === 'production';
//
var CleanPlugin = require('clean-webpack-plugin');

// What this plugin does is exactly what I just said: gather a certain type of content from your final bundle,
// and pipe it elsewhere, most common use case being for CSS.
var ExtractPlugin = require('extract-text-webpack-plugin');

var plugins = [
    new ExtractPlugin('bundle.css', { allChunks: true }), // <=== where should content be piped

    new webpack.optimize.CommonsChunkPlugin({
        name: 'main', // Move dependencies to our main file
        children: true, // Look for common dependencies in all children,
        minChunks: 2, // How many times a dependency must come up before being extracted
    }),
];

if (production) {
    plugins = plugins.concat([

        // Cleanup the builds/ folder before
        // compiling our final assets
        new CleanPlugin('builds'),

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__: !production,
            'process.env': {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),

    ]);
}

module.exports = {
    //  To minify our HTML and CSS,
    //  the css-loader and html-loader already take care of that by default if the debug option is false.
    debug: !production,
    devtool: production ? false : 'eval',
    entry: './src',
    output: {
        path: 'builds',
        filename: production ? '[name]-[hash].js' : 'bundle.js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'builds/'
    },
    devServer: {
        hot: true,
    },
    plugins: plugins,
    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel',
            include: __dirname + '/src'
        }, {
            test: /\.scss/,
            loader: ExtractPlugin.extract('style', 'css!sass')
            // Or loaders: ['style', 'css', 'sass']
        }, {
            test: /\.html/,
            loader: 'html',
            include: __dirname + '/src'
        }, {
            test: /\.(png|gif|jpe?g|svg)$/i,
            loader: 'url?limit=10000'
            // Here, we’re passing a limit query parameter to the url-loader which tells it: if the asset is smaller than 10kb inline it,
            // else, fallback to the file-loader and reference it.
            // That syntax is called a query string, you use it to configure loaders,
            // alternatively you can also configure loaders through an object:
            // loader: 'url',
            // query: {
            //     limit: 10000,
            // }
        }]
    }
};
