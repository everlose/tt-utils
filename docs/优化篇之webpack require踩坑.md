## 问题场景

希望 md 文件通过一份 map.json 配置全部拉取到，便于维护不需要再次修改 router 文件内容。

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import routesMap from './map.json';

Vue.use(Router);

let routes = routesMap.map((route) => {
    return {
        path: route.path,
        name: route.name,
        component: require(`../pages/${route.componentName}.md`)
    };
});

routes.push({
    path: '/', // 根路径，重定向到工作台
    redirect: '/changelog'
});

console.log(routes);

export default new Router({
    history: false,
    routes: routes
});
```

这一段函数是我从 webpack2 中复制来的，居然在我新检出的 webpack3 中报错，当然一开始我也没有想到是 webpack 版本问题，跟着下方的报错提示我只能想到 require 进来的文档肯定不正确

```
[Vue warn]: Failed to mount component: template or render function not defined.
```

## 分析

所以我在两个项目中分别 `console.log(routes)` 。

新项目 webpack3 输出

```javascript
[
    {
        "path": "/changelog",
        "name": "changelog",
        "component": {
            "default": {
                "staticRenderFns": [
                    null
                ],
                "_compiled": true,
                "__file": "example/pages/changelog.md",
                "beforeCreate": [
                    null
                ],
                "beforeDestroy": [
                    null
                ]
            },
            "_Ctor": {},
            "inject": {},
            __esModule: true
        }
    },
    {
        "path": "/",
        "redirect": "/changelog"
    }
]
```

而老项目 webpack2 输出

```javascript
[
    {
        "path": "/changelog",
        "name": "changelog",
        "component": {
            "staticRenderFns": [
                null
            ],
            "__file": "example/pages/changelog.md",
            "beforeCreate": [
                null
            ],
            "beforeDestroy": [
                null
            ],
            "_Ctor": {},
            "inject": {}
        }
    },
    {
        "path": "/",
        "redirect": "/changelog"
    }
]
```

对比新旧项目输出发现新项目中的 component 下多包了一层 default，而且还有一个属性 `__esModule: true`，却是不知为何 require 进来的东西却被当作 esModule。

## 解决

```
let routes = routesMap.map((route) => {
    return {
        path: route.path,
        name: route.name,
        component: require(`../pages/${route.componentName}.md`).default
    };
});

// 或者 component: resolve => require([`../pages/${route.componentName}.md`], resolve)
```

## 深入webpack

最后翻来覆去的找答案，在一篇探索 webpack3 的文章上找到了思路，[探索webpack模块以及webpack3新特性](https://juejin.im/post/59b9d2336fb9a00a636a3158)。

```javascript
/******/     // getDefaultExport function for compatibility with non-harmony modules 解决ES module和Common js module的冲突，ES则返回module['default']
/******/     __webpack_require__.n = function(module) {
/******/         var getter = module && module.__esModule ?
/******/             function getDefault() { return module['default']; } :
/******/             function getModuleExports() { return module; };
/******/         __webpack_require__.d(getter, 'a', getter);
/******/         return getter;
/******/     };
```

在文中的一段揭示 webpack3 编译后的代码里，我找到了熟悉的 module.__esModule，原来esModule是这等用处，那么为何在 webpack2 中没有被标记为 esModule 呢？

我在 webpack3 编译后的 app.js 搜索 `changelog.md`，发现了一个东西

![](http://7xn4mw.com1.z0.glb.clouddn.com/17-11-20/49735056.jpg)

编译后的 app.js 里，是 eval 执行了引入整个编译 changelog.md 的代码，非常长。而在 eval 中打头的就看到我们熟悉的老朋友__esModule

```
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true }) .........
```

而这个标识在 webpack2 编译后的代码是找不到的，如下图所见，编译后的 app.js 直接返回了 Components，没有用 eval 包裹并塞入 esModule 标识

![](http://7xn4mw.com1.z0.glb.clouddn.com/17-11-21/1097434.jpg)

虽然还是有些迷糊，不过我大致上推断就是 webpack3 新特性里编译打包的机制改动了吧，毕竟其他的 vue-markdown-loader 之类的插件，两个项目所用的版本一摸一样。

## 结语

项目主体结构已经稳定，代码在 [tag v0.0.6](https://github.com/everlose/tt-utils/jqfree/tree/v0.0.6) 上

上一篇：[md示例文档编写篇](https://github.com/everlose/tt-utils/blob/master/docs/md%E7%A4%BA%E4%BE%8B%E6%96%87%E6%A1%A3%E7%BC%96%E5%86%99%E7%AF%87.md)
