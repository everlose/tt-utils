## 前言

看到公司里的大佬都纷纷写起vue相关的文章，有分析vue源码的，有定制ui库的，混在大佬中我感到既有压力又有动力，我也得写点什么。

回想写业务这么长时间，总是有些函数需要粘贴来复制去，第三方提供的库总只是部分函数满足自己的需求，于是萌生了一个想法，何不如来定制一个专给自己用的库函数呢，放着我所有能从业务里抽象出来的函数。

搭一个库有许许多多的细小的知识点，很难一篇讲的完碰上的所有障碍，于是我决定以写记事的形式来记载我每次的想法以及实现的步骤还有碰上的问题，所以文章会分很多篇，并且持续更新写上我最新放入的函数。

大致规定会有以下目录，并且贴上[本项目 github 地址](https://github.com/everlose/tt-utils)

* 项目初建
* hello world
* 第一个函数 formatTime
* 单测编写
* npm 发布相关
* example 实例文档使用 markdown
* 第x个函数 ......


## 项目初建

本人的 vue-cli 版本是 2.8.2，本篇的实例代码都放在这个[tag v0.0.1](https://github.com/everlose/tt-utils/jqfree/tree/v0.0.1)，请自行访问参考。

```bash
$ vue init webpack tt-utils

? Project name tt-utils
? Project description ctt's utils library
? Author everlose <ever-lose@foxmail.com>
? Vue build?  standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset?  Standard
? Setup unit tests?  Yes
? Pick a test runner?  karma
? Setup e2e tests with Nightwatch?  No
   vue-cli · Generated "tt-utils".

   To get started:

     cd tt-utils
     npm install
     npm run dev

   Documentation can be found at https://vuejs-templates.github.io/webpack

```

既然是个人的函数库，自然是照着我自己喜欢的格式来了，我喜欢用 Standard 的 eslint 规则，并且加入 karma 和 mocha 进行 unit 单测，这里不进行业务测试所以不需要 e2e 测试。

以防有人会问 unit test 和 e2e test 什么区别吧，[贴个科普链接](https://segmentfault.com/q/1010000009527765)


## hello world

一、本人是忠实的4格党，vue-cli检出的项目却是2格缩进的，所以首先整改 .editorconfig 文件后在全局调整代码格式

__.editorconfig__

```
# ...

indent_size = 4

# ...
```

二、将原 src 文件夹重命名为 example，这个目录很合适作为我们函数库的 demo 演示和说明页面。

三、再新建一个 src 文件夹作为我们的函数库源码所在，并加入一个 src/main.js 文件作为我们的初始函数库，那么就导出一个 hello world 吧。

__src/main.js__

```
export default {
    text: 'hello world'
};
```

四、与此同时得修改 webpack 的编译文件中关于引用src路径的代码，以供能够运行起 example 的代码

__build/webpack.base.conf.js__

```
// ...
entry: {
    app: './example/main.js'
}

// ...
alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('example'),
    '~': resolve('src'),
}

// ...
test: /\.(js|vue)$/,
loader: 'eslint-loader',
enforce: 'pre',
include: [resolve('src'), resolve('example'), resolve('test')],

//...
test: /\.js$/,
loader: 'babel-loader',
include: [resolve('src'), resolve('example'), resolve('test')]
```

__package.json__

```
"lint": "eslint --ext .js,.vue src example test/unit/specs",
```

五、修改 example/main.js 让我们的 demo 能输出 hello world

__example/main.js__

```
//...
import ttUtils from '~/main.js';

console.log(ttUtils.text);
//...
```

六、此时 npm install && npm run dev 启动的时候会发现控制台一堆 eslint 输出的错误，于是再加一步修改 eslint 规则的吧

__.eslintrc.js__

```
'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // 缩进规定为4个空格
    "indent": [2, 4, {"SwitchCase": 1}],
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 语句必须以分号结尾
    "semi": [
        2,
        "always"
    ],
    "no-console": 1,
    "no-alert": 1,
    "space-before-function-paren": [0, "always"]
}
```

我喜欢带分号结尾，并且缩进是四个空格的代码。保存生效后还得调整一些eslint提示的错误，这里不一一例举，众位看官自己处理吧。

## 结果

![](http://7xn4mw.com1.z0.glb.clouddn.com/17-11-16/39741043.jpg)

万事总得以hello world开始。

本篇的实例代码都放在这个[tag v0.0.1](https://github.com/everlose/tt-utils/jqfree/tree/v0.0.1)，请自行访问参考。

下一篇来具体加入第一个函数，未完待续。
