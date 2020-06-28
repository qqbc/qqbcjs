const path = require('path');

module.exports = {
    entry: {
        qqbcjs_api: './src/qqbcjs-api.ts',
        qqbcjs_jsonrpc: './src/rpc-web.ts',
        qqbcjs_jssig: './src/qqbcjs-jssig.ts',
        qqbcjs_numeric: './src/qqbcjs-numeric.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.web.json'
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: x => x.chunk.name.replace('_', '-') + '-debug.js',
        library: '[name]',
        path: path.resolve(__dirname, 'dist-web', 'debug'),
    }
};
