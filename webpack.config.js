const path = require('path');

module.exports = {
    entry: {
        app: './src/assets/js/app.js'
    },
    output: {
        filename: '[name].js',
        // publicPath: '/js/', // public path is defined dynamically based on the installation folder
        path: path.resolve(__dirname, 'assets/js')
    },
    devtool: 'source-map',
    plugins: [],
    module: {
        rules: [
            {
                test: /\.js?/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};
