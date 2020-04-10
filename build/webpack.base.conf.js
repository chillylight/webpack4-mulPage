/*
* @Author: chillylight
* @Date:   2019-09-17 11:03:20
* @Last Modified by:   chillylight
* @Last Modified time: 2020-04-10 17:03:20
*/
const path = require('path');
const webpack = require("webpack");
const glob = require("glob-all");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
const rules = require("./webpack.rules.conf.js");
// 获取html-webpack-plugin参数的方法
let getHtmlConfig = function (name, chunks) {
	return {
		template: path.join(__dirname,`../src/pages/${name}/index.html`),
		filename: `project/${name}.html`,
		// favicon: './favicon.ico',
		// title: title,
		inject: true,
		hash: false, //开启hash  ?[hash]
		chunks: [name,'commons', 'vendors', 'manifest'],
		// chunks: [name],
		minify: process.env.NODE_ENV === "development" ? false : {
			removeComments: true, //移除HTML中的注释
			collapseWhitespace: false, //折叠空白区域 也就是压缩代码
			collapseInlineTagWhitespace: true, //压缩tab键
			removeAttributeQuotes: true, //去除属性引用
			trimCustomFragments: true
		},
	};
};

//动态添加入口
function getEntry(PAGES_DIR) {
	var entry = {};
	//读取src目录所有page入口
	glob.sync(PAGES_DIR + '**/index.js').forEach(function (name) {
		var start = name.indexOf('pages/') + 4;
		var end = name.length - 3;
		var eArr = [];
		var n = name.slice(start, end);
		if (n.split("/").length == '3') {
			n = n.split('/')[1];
		}else if (n.split("/").length == '4') {
			n = n.split('/')[1] + '/' + n.split('/')[2];
		}else if(n.split("/").length == '5'){
			n = n.split('/')[1] + '/' + n.split('/')[2] + '/' + n.split('/')[3];
		}
		
		eArr.push(name);
		entry[n] = eArr;
	})

	return entry;
}

let entrys = getEntry('./src/pages/');

module.exports = {
	entry: entrys,
	module: {
		rules: [...rules]
	},
	//将外部变量或者模块加载进来
	externals: {
		// 'jquery': 'window.jQuery'
	},
	plugins: [
		// 全局暴露统一入口
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			'window.$': 'jquery',
			'window.jQuery': 'jquery'
		}),
		//静态资源输出
		new copyWebpackPlugin([{
			from: path.resolve(__dirname, "../src/assets/images/favicon.ico"),
			to: './static/images'
		}]),
	],
	resolve: {
	    alias: {
	    	'@': path.join(__dirname, '..'),
	    	'@src': path.join(__dirname, '..', 'src')
	    }
	},
	// 配置webpack执行相关
	performance: {
	    maxEntrypointSize: 100000000, // 最大入口文件大小
	    maxAssetSize: 100000000 // 最大资源文件大小
	}
}

//修改自动化配置页面
var htmlArray = [];
Object.keys(entrys).forEach(function (element) {
	htmlArray.push({
		_html: element,
		title: '',
		chunks: [element]
	})
})

//自动生成html模板
htmlArray.forEach((element) => {
	module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})