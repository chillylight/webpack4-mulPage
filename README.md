# webpack4-mulPage

#### 介绍

采用webpack4搭建多页应用demo。由于项目需要SEO等诸多原因。需要搭建基于jquery的多页应用，脚手架主要参考了[https://github.com/zhouyupeng/webpack4.x_demo](https://github.com/zhouyupeng/webpack4.x_demo),但是其中挺多地方觉得不太方便，便着手改造了下，以便未来更方便使用。

#### 软件架构

使用webpack搭建jquery多页应用,css预编译器使用scss.

#### 目录结构

src:文件主文件夹:

- assets:包括css、js、fonts、images、json
- layout:公用模板文件夹
- pages:页面文件夹，例如：index文件夹下包含index.html、index.js、index.scss

#### 使用说明

安装：

```
npm install //或
cnpm install
```

使用:

```
1. npm run dev // 开发环境
2. npm run build // 生产环境打包
3. npm run c page // 新建页面，page代表页面的命名，执行后会在/src/pages/目录下自动创建page文件夹，并且在pages文件夹里创建index.html，index.js ，index.scss
4. npm run build --report // 打包并打开分析页面
```