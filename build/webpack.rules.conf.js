/*
* @Author: chillylight
* @Date:   2019-09-17 11:17:09
* @Last Modified by:   chillylight
* @Last Modified time: 2020-04-10 16:58:38
*/
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const rules = [{
		test: /\.(css|scss|sass)$/,
		use: [
			devMode ? 'style-loader' : {
				loader: MiniCssExtractPlugin.loader,
				options: {
					// you can specify a publicPath here
					// by default it use publicPath in webpackOptions.output
					publicPath: '/'
				}
			},
			{
				loader:'css-loader',
				options:{
					importLoaders:2
				}
			},
			// 'css-loader',
			'postcss-loader',
			'sass-loader',
			{
	        	loader: 'sass-resources-loader',
	        	options: {
		            // Provide path to the file with resources
		            resources: path.resolve(__dirname,'../src/assets/css/vars.scss')
	        	},
	        },
		]
	},
	{
		test: /\.js$/,
		use: ["babel-loader"],
		// 不检查node_modules下的js文件
		exclude: "/node_modules/"
	}, 
	{
		test: /\.(png|jpg|gif|jpeg)$/,
		use: [{
			// 需要下载file-loader和url-loader
			loader: "url-loader",
			options: {
				limit: 3 * 1024, //小于这个时将会已base64位图片打包处理
				name:'[name].[hash:8].[ext]',
				// 图片文件输出的文件夹
				outputPath: "static/images/"
			}
		}]
	},
	{
		test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: 10000,
			name:'[name].[hash:8].[ext]',
			// 图片文件输出的文件夹
			outputPath: "static/fonts/"
		}
	},
	{
		test: /\.html$/,
		// html中的img标签
		use: ["html-withimg-loader"]
	}, 
	// 使用expose处理JQuery（JQ使用npm安装）配置了这一条后就不要使用external（主要用于cdn引入）
	{
	    test: require.resolve('jquery'), // 此loader配置项的目标是NPM中的jquery
	    loader: 'expose-loader?$!expose-loader?jQuery' // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
	},
];
module.exports = rules;