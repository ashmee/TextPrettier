const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'production' ? false : 'inline-source-map',

    entry: {
        ui: './src/ui.tsx',
        code: './src/code.ts',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.svg/,
                type: 'asset/inline',
            },
        ],
    },

    resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: 4,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/manifest.json',
                    to: './manifest.json',
                },
            ],
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './src/ui.html',
            filename: 'ui.html',
            chunks: ['ui'],
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
        new webpack.DefinePlugin({
            global: {},
        }),
    ],
})
