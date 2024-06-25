const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
	entry: path.join(__dirname, 'src', 'index.js'),
	output: {
		filename: 'bundle.[contenthash:8].js',
		path: path.join(__dirname, 'dist'),
		assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
		clean: true
	},

	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg|gif)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.html$/i,
				loader: 'html-loader'
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},

	devServer: {
		static: {
			directory: path.join(__dirname, 'dist')
		},
		open: true
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'index.html'),
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:8].css'
		})
	],

	mode: 'development'
}
