## 前言

总有种到了现在才进入正题的感觉，2333。

## 代码修改

__package.json__

```
...
"name": "tt-utils",
"main": "src/main.js",
"repository": {
  "type": "git",
  "url": "https://github.com/everlose/tt-utils.git"
},
"peerDependencies": {
  "vue": "2.x"
},
"keywords": [
  "vue",
  "util library"
],
"bugs": "https://github.com/everlose/tt-utils/issues"
...
```

加一些描述这个包文件的字段。其中最为重要的是 main 入口，它决定了在引用这个包的时候会去找哪个文件。

比方说在业务项目中引用我们的自定义函数库

```
import ttUtils from 'tt-utils'
```

这个 ttUtils 的变量其实就是 tt-utils/src/main.js 所导出的。

__.npmignore__

发布到 npm 上的包不需要让用户看到我们 example 路径，node_modules，test 单测目录等东西，于是都过滤掉。

```
test/
dist/
example/
static/
config/
node_modules/
build/
.babelrc
.eslintrc
.gitattributes
.editorconfig
.gitignore
*.log
.tmp
.DS_Store
.idea
```

## 发布运行

```
npm publish
```

bug，WTF，出现了403

```
$ npm publish
npm ERR! publish Failed PUT 403
npm ERR! code E403
npm ERR! no_perms Private mode enable, only admin can publish this module: @ctt/tt-utils

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/everlose/.npm/_logs/2017-11-17T06_30_52_054Z-debug.log
```

哦，我才想起来，我曾经把源改成了淘宝的，当然没有权限在上发东西了，于是乎运行一下命令切换回 npm 官网源

```
# nrm 是一个切换npm源的工具
# 如果没有装那就
# npm config set registry http://www.npmjs.org

$ nrm use npm

   Registry has been set to: https://registry.npmjs.org/
```

再来一次 `npm publish`

```
$ npm publish
npm ERR! code ENEEDAUTH
npm ERR! need auth auth required for publishing
npm ERR! need auth You need to authorize this machine using `npm adduser`

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/everlose/.npm/_logs/2017-11-17T06_36_56_539Z-debug.log
```

额，忘了说，得需要在 npm 官网上注册账号才能发，注册的步骤请自行查阅吧，本人已经有了一个账号于是在本地 npm 添加上

```
$ npm addUser
Username: everlose
Password:
Email: (this IS public) ever-lose@foxmail.com
Logged in as everlose on https://registry.npmjs.org/.
```

```
$ npm publish
+ tt-utils@1.0.0
```

ok发布成功了，[地址在这儿](https://www.npmjs.com/package/tt-utils)npm 官网的源要下载起来比较慢，淘宝的源大概是10分钟同步一次 npm 官网的。

看官老爷们可以自己建个vue项目来引用它了，业务项目里是这么用的

```
import Vue from 'vue'
import ttUtils from 'tt-utils'

Vue.use(ttUtils.formatTime);
```

## 优化

我们前面居然把 src/main.js 当作入口发上去了，而 src/main.js 是用 es6 语法写就的，如果某天你在业务项目中没有用es6，这岂不是GG了，于是需要把代码编译打包一份，压缩混淆一份出来提供使用。

那么需要引入 webpack 打包，废话不说，上代码。

__webpack.release.js__

加入一份 webpack.release.js 内容如下：

```
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
```

很简单的配置，把 src 下的源码 babel 转译下 在 eslint 检测下语法就行了，最终输出为 bundle/ttUtils.js。

我们只需要用用es6的方式写代码，编译成 umd 就交给 webpack 打包就行了，有关于 libraryTarget 详情可以看看 [webpack 中文文档](https://doc.webpack-china.org/configuration/output/#output-library)。

__webpack.release.min.js__

和上面相似

```
module.exports = {
    entry: ['./src/main.js'],
    output: {
        filename: './bundle/tt-utils.min.js',
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

```

__package.json__

需要修改 main 入口，并且再加一条 release 命令，别忘了更新下 version 版本

```
...
"version": "1.0.1",
"main": "bundle/tt-utils.min.js",
...
"scripts": {
  ...
  "release": "webpack --config build/webpack.release.js && webpack -p --config build/webpack.release.min.js"
}
...
```

打包生成 bundle 下的代码吧，运行以下命令顺利的话会看到 bundle 文件夹下多了两个文件。

```
$ npm run release

> tt-utils@1.0.0 release /Users/everlose/workspace/github/tt-utils
> webpack --config build/webpack.release.js && webpack -p --config build/webpack.release.min.js

Hash: 1ab049d6a055a193197c
Version: webpack 3.8.1
Time: 1738ms
...
```

发布

```
$ npm publish
+ tt-utils@1.0.1
```

## 结果

可以看到在本地检出的其他测试项目里引入我们的函数库，node_modules/tt-utils 如下

```
.
|____.eslintignore
|____.eslintrc.js
|____.postcssrc.js
|____bundle
| |____tt-utils.js
| |____tt-utils.min.js
|____index.html
|____package.json
|____README.md
|____src
| |____formatTime.js
| |____main.js
```

简练的结构，package.json 的 main 入口被设为 bundle/tt-utils.min.js ，如果调试的时候发现不对，只要修改为 src/main.js 就可以照着源码调试了。

本篇代码在[tag v0.0.3](https://github.com/everlose/tt-utils/tree/v0.0.3)上。

我发现每过两个月回头看自己以前的代码都会觉得好傻逼，只有时时更新自己最新的体会的代码才能让自己满意，那么截至目前，代码没有任何的测试，某天觉得某段函数写的不好，想重构那段，没有测试十分容易踩坑，于是下篇分析如何写单测。

未完待续。
