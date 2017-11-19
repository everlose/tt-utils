## 前言

工作当中如果直接使用我们自定的库，会让日后维护你的项目的同学在代码中发现一个的函数搜遍项目也找不到，会感到无比抓狂。

想办法改善这种情况那就需要给你的函数库项目写一份说明文档还得附带示例，最好还能发布到公司内网的某个地方。而且希望说明文档中可以直接附带示例，答案就是 vue-markdown-loader 插件了

## 解析 md 文档的配置代码

安装依赖

```bash
$ npm install vue-markdown-loader markdown-it markdown-it-anchor markdown-it-container cheerio  highlight.js --save-dev
```

接着在 webpack 中引入 vue-markdown-loader 插件解析 markdown 文件文档。

__build/webpack.base.config.js__

```javascript
// ...
var utilsMd = require('./utils-md');
// ...

module: {
    rules: [
        // ...
        {
            test: /\.md$/,
            loader: 'vue-markdown-loader',
            options: utilsMd.markdownLoader()
        }
        // ...
    ]
}
```

关于 __build/utils-md.js__ , markdownIt 的详细用法参见 [markdown-it](https://github.com/markdown-it/markdown-it)

```

var cheerio = require('cheerio');
var markdownIt = require('markdown-it');
var markdownItContainer = require('markdown-it-container');
var markdownItAnchor = require('markdown-it-anchor');
var hljs = require('highlight.js');

function _convert(str) {
    str = str.replace(/(&#x)(\w{4});/gi, function($0) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
    });
    return str;
}

function _strip(str, tags) {
    var $ = cheerio.load(str, {decodeEntities: false});

    if (!tags || tags.length === 0) {
        return str;
    }

    tags = !Array.isArray(tags) ? [tags] : tags;
    var len = tags.length;

    while (len) {
        len -= 1;
        $(tags[len], 'head').remove();
    }

    return $('head').html();
}

function _renderHighlight(str, lang) {
    if (!(lang && hljs.getLanguage(lang))) {
        return '';
    }

    return hljs.highlight(lang, str, true).value;
}
function _wrap(render) {
    return function() {
        return render.apply(this, arguments) // eslint-disable-line
            .replace('<code class="', '<code class="hljs ')
            .replace('<code>', '<code class="hljs">');
    };
}
exports.markdownLoader = function () {
    var md = markdownIt({
        preset: 'default',
        breaks: true,
        html: true,
        highlight: _renderHighlight
    });
    md.renderer.rules.table_open = function () {
        return '<table class="docs-demo__table">';
    };
    md.renderer.rules.fence = _wrap(md.renderer.rules.fence);
    return md
    .use(markdownItContainer, 'demo', {
        validate: function(params) {
            return params.trim().match(/^demo\s*(.*)$/);
        },
        render: function(tokens, idx) {
            var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);

            if (tokens[idx].nesting === 1) {
                var title = (m && m.length > 1) ? m[1] : '';
                var desc = '';
                var content = tokens[idx + 1].content;

                if (!content) {
                    content = tokens[idx + 4].content;
                    desc = tokens[idx + 2].content;
                    // 移除描述，防止被添加到代码块
                    tokens[idx + 2].children = [];
                }

                var html = _convert(_strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1');

                return `<div>
                        <div slot="source">${html}</div>
                        <div slot="title">${title}</div>
                        <div slot="desc">${md.renderInline(desc)}</div>
                        <div slot="highlight">`;
            }
            return '</div></div>\n';
        }
    });
};
```

## example 代码

在 __example/router/index.js__ 里加入路径

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import formatTime from '@/pages/formatTime.md'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/formatTime',
            name: 'formatTime',
            component: formatTime
        },
        {
            path: '/',
            redirect: '/formatTime'
        }
    ]
});

```

加入第一份文档内容

__example/pages/formatTime.md__

    ## formatTime 简介

    时间格式化函数

    ## 代码演示

    :::demo 基础用法

    filter 用法

    ```html
    <template>
        <p>format {{ time }} to {{ time | formatTime('YYYY-MM-DD') }}</p>
    </template>

    <script>
    export default {
        data() {
            return {
                time: Date.now()
            };
        }
    };
    </script>
    ```
    :::

    ## API

    | 参数 | 说明 | 类型 | 可选值 | 默认值 |
    |---------- |-------- |---------- |-------------  |-------- |
    | value | 时间戳 | Number | | |
    | format | 复制完成后的回调函数 | Function | 'YYYY-MM-DD hh:mm:ss' 这样的形式 | |


    <script>
    export default {
        data() {
            return {
                time: Date.now()
            };
        }
    };
    </script>


文档中的示例就是 template 那一段，演示把当前时间转化为 YYYY-MM-DD 模式。

## 启动

```bash
$ npm run dev
```

发现写的示例代码有运行出结果，而不是单纯的静态文档。

![](http://7xn4mw.com1.z0.glb.clouddn.com/17-11-19/91977823.jpg)

额，居然居中对齐了，把 example/App.vue 中的 style 去掉，然后引入 github 风格的代码高亮规则吧

```
<style>
@import 'highlight.js/styles/github.css';
</style>
```

这样看起来比较舒服

![](http://7xn4mw.com1.z0.glb.clouddn.com/17-11-19/92540351.jpg)

只要加个 vue-router 来切换 md 文档路径，我们就达成了文档构建的目的，如何发布 example 文档到服务器上就超脱本篇范畴了，请各位自行尝试吧。

## 结语

项目主体结构已经稳定，代码在 [tag v0.0.5](https://github.com/everlose/tt-utils/jqfree/tree/v0.0.5) 上

上一篇：[单测编写篇](https://github.com/everlose/tt-utils/blob/master/docs/%E5%8D%95%E6%B5%8B%E7%BC%96%E5%86%99%E7%AF%87.md)
