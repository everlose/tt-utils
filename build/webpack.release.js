module.exports = {
    entry: ['./src/main.js'],
    output: {
        filename: './bundle/tt-utils.js',
        library: 'ttUtils',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'eslint-loader'],
                enforce: 'pre'
            }
        ]
    }
};
