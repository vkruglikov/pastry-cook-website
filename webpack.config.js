const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: !isProduction ? 'inline-source-map' : false,
        entry: {
            main: './src/frontend/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'www/static'),
            publicPath: '/static/',
            filename: '[name].[contenthash].bundle.js'
        },
        resolve: {
            modules: [
                'node_modules'
            ],
            extensions: ['.js', '.jsx']
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'img/',
                                name: '[name].[contenthash].[ext]',
                                publicPath: '/static/img'
                            }
                        },
                    ],
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
                {
                    oneOf: [
                        {
                            test: /\.module\.css$/i,
                            use: ['style-loader', {
                                loader: 'css-loader',
                                options: {
                                    modules: true,
                                    sourceMap: !isProduction
                                }
                            }],
                        },
                        {
                            test: /\.css$/i,
                            use: ['style-loader', 'css-loader'],
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: "babel-loader"
                        },
                        {
                            loader: "react-svg-loader",
                            options: {
                                jsx: true // true outputs JSX tags
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new ManifestPlugin(),
            new CleanWebpackPlugin({
                verbose: !isProduction
            }),
            // new BundleAnalyzerPlugin()
        ].filter(plugin => plugin)
    };
};