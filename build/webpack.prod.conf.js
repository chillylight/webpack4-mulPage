/*
* @Author: chillylight
* @Date:   2019-09-17 13:16:18
* @Last Modified by:   chillylight
* @Last Modified time: 2020-04-03 11:40:14
*/
const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录等
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//4.x之后用以压缩
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//4.x之后提取css
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfigBase = require('./webpack.base.conf');
const webpackConfigProd = {
	mode: 'production', // 通过 mode 声明生产环境
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'static/js/[name].[contenthash:8].js',
		publicPath: '/'
	},
	plugins: [
		//删除dist目录
		new CleanWebpackPlugin(),
		// 分离css插件参数为提取出去的路径
		new miniCssExtractPlugin({
			filename: 'static/css/[name].[contenthash:8].min.css',
		}),
		//压缩css
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		//上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
		//https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
		new UglifyJSPlugin({
			uglifyOptions: {
				warnings: false,
				compress: {
					drop_debugger: false,
					drop_console: true
				}
			},
			sourceMap: true
		}),
	],
	devtool: 'cheap-module-source-map', // cheap-module-source-map||none
	module: {
		rules: []
	},
	optimization: {
        minimize: false,
        splitChunks: { // 配置提取公共代码
            chunks: 'all',
            minSize: 10000, // 配置提取块的最小大小（即不同页面之间公用代码的大小）
            minChunks: 2, // 最小共享块数，即公共代码最少的重复次数一般设为2
            automaticNameDelimiter: '~', // 生成的名称指定要使用的分隔符
            cacheGroups: { // 设置缓存组
                vendors: { // 抽离第三方插件
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    /*test(module) { // 指定是node_modules和lib下的第三方包
                        let path = module.resource
                        return /[\\/]node_modules[\\/]/.test(path) || /[\\/]lib[\\/]/.test(path)
                    },*/
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 30
                },
                commons: { // 抽离自己写的公共代码，commons这个名字可以随意起
                    name: 'commons',
                    minChunks: 2,
                    // test: /\.js$/,
                    reuseExistingChunk: true, // 如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                    enforce: true, // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
                    minSize: 0,    // 只要超出0字节就生成一个新包
                    priority: 20
                }
            }
        },
        /* 优化持久化缓存的, runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载)
             和 模块信息清单, 模块信息清单在每次有模块变更(hash 变更)时都会变更, 所以我们想把
             这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含模块
             信息的模块(通常会被包含在最后一个 bundle 中)缓存失效. optimization.runtimeChunk 
             就是告诉 webpack 是否要把这部分单独打包出来.*/
        runtimeChunk: {
            name: 'manifest' // 打包运行文件
        }
    }
}

if(process.env.npm_config_report){//打包后模块大小分析//npm run build --report
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfigProd.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = merge(webpackConfigBase, webpackConfigProd);