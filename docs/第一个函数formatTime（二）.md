## 前言

呃，我平日里写业务的时候，最为频繁遇见的大概就是时间格式化函数了，公司里的时间格式比较混乱，后端传回来的可能是时间戳，2017-01-01，或者2017/01/01这样的，我也不希望这么简单的一个函数还得引入 moment 来解决。


## src 源码

__src/formatTime.js__

```javascript
/**
 * 格式化时间函数，create by chentongta。
 *
 * @param  Number  value    [时间戳，number类型，以毫秒为单位]
 * @param  String  format   [格式化的结构，常见填'YYYY/MM/DD hh:mm:ss+S'，最多可精确到毫秒级别]
 * @return String           [参照format的格式化结果]
 */

let formatTime = function (value, format) {
    // for example => new Date(null) or new Date('') or new Date(0) or or new Date(undefined)
    if (!value) return '';
    // for example => new Date('2011年12月') or new Date('adsdf')
    if (Number.isNaN(+value)) return value;

    var date = new Date(value);
    // Can't parse to a invalid Date object. for example => new Date(149077400686412312313)
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    var o = {
        'M+': date.getMonth() + 1, // month
        'D+': date.getDate(), // day
        'h+': date.getHours(), // hour
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'S': date.getMilliseconds() // millisecond
    };

    if (/(Y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            date.getFullYear().toString().substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

export default {
    install (Vue, pluginOptions = {}) {
        // Vue.formatTime, vm.$formatTime
        Vue.formatTime = Vue.prototype.$formatTime = formatTime;
        // {{ time | formatTime('YYYY-MM-DD') }}
        Vue.filter('formatTime', function (value, format) {
            if (!format) {
                return value;
            }
            return formatTime(value, format);
        });
    }
};

```

哦，对了，工作用的是vue，于是自然就注册成了vue插件来引入，如果有对vue插件不了解的同学，那就去瞧瞧[vue 官网](https://vuefe.cn/v2/guide/plugins.html)吧，当然如果你用的不是vue也不打紧，直接暴露 formatTime 函数也是一样。

__src/main.js__

```
import formatTime from './formatTime';

export default { formatTime };
```

## example 示例改写

__example/main.js__

```
// ...
import ttUtils from '~/main.js';

Vue.use(ttUtils.formatTime);
//...
```

注册组件，所有 vue 文件里都能使用。

__example/App.vue__

```
{{ time | formatTime('YYYY-MM-DD') }}
{{ time1 }}
{{ time2 }}
...
<script>
import Vue from 'vue';

export default {
    name: 'app',
    data () {
        return {
            time: new Date(),
            time1: new Date(),
            time2: new Date()
        };
    },
    created() {
        this.time1 = Vue.formatTime(this.time1, 'YYYY-MM-DD');
        this.time2 = this.$formatTime(this.time2, 'YYYY-MM-DD');
    }
}
</script>
...
```

## 结果

本人运行后顺利页面出现了三个 2017-11-17，那么函数生效了。

本篇所有代码在 [tag v0.0.2](https://github.com/everlose/tt-utils/tree/v0.0.2) 中

下一片写发布到 npm 仓库上，未完待续。
