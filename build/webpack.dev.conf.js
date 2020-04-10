/*
* @Author: chillylight
* @Date:   2019-09-17 11:00:06
* @Last Modified by:   chillylight
* @Last Modified time: 2020-04-09 09:38:20
*/
const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigDev = {
	mode: 'development', // 通过 mode 声明开发环境
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'static/js/[name].bundle.js',
		publicPath: '/'
	},
	devServer: {
		contentBase: path.join(__dirname, "../dist"),
		publicPath:'/',
		host: "localhost",
		port: "8089",
		openPage:'trans/',
		overlay: true, // 浏览器页面上显示错误 
		open: true, // 开启浏览器
		// stats: "errors-only", //stats: "errors-only"表示只打印错误：
		hot: true, // 开启热更新
		// hotOnly:true,
		proxy: {
	        '/api': {
	            target: 'http://develop.fanyigou.net',
	            changeOrigin: true,
	            pathRewrite: {
	                '^/api': ''
	            },
	            secure:false,
	            // 在代理收到请求之后将数据发给浏览器之前做一层拦截,修改set-cookie中domain为localhost
	            onProxyRes: function(proxyRes, req, res) {
	                var cookies = proxyRes.headers['set-cookie'];
	                var cookieRegex = /Domain=fanyigou.net/i; // 返回的cookie中提取domain
	                //修改cookie Path
	                if (cookies) {
	                    var newCookie = cookies.map(function(cookie) {
		                    if (cookieRegex.test(cookie)) {
		                        // 将domain设置为localhost
								return cookie.replace(cookieRegex, 'Domain=localhost');
		                    }
		                    return cookie;
		                });
	                    delete proxyRes.headers['set-cookie'];
	                    proxyRes.headers['set-cookie'] = newCookie;
	                }
	            }
	        }
    	},
	},
	plugins: [
		//热更新
		new webpack.HotModuleReplacementPlugin(),
	],
	devtool: "cheap-module-eval-source-map",  // 开启调试模式
	module: {
		rules: []
	}
}
module.exports = merge(webpackConfigBase, webpackConfigDev);