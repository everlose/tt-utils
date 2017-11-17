# tt-utils [![Build](https://img.shields.io/circleci/project/pagekit/tt-utils/develop.svg)](https://circleci.com/gh/pagekit/tt-utils) [![Downloads](https://img.shields.io/npm/dm/tt-utils.svg)](https://www.npmjs.com/package/tt-utils) [![Version](https://img.shields.io/npm/v/tt-utils.svg)](https://www.npmjs.com/package/tt-utils) [![License](https://img.shields.io/npm/l/tt-utils.svg)](https://www.npmjs.com/package/tt-utils)

ctt\'s utils library 个人业务函数库，希望能给你一些启发，希望也构建一个自己的函数库的同学参见[docs目录](https://github.com/everlose/tt-utils/blob/master/docs/step%201.md)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run unit tests and watch file
# npm run unit:watch

# build for release npm package
npm run release
```

## Example

__main.js__

```js
import Vue from 'vue'
import ttUtils from 'tt-utils'

Vue.use(ttUtils.formatTime);
```

__App.vue__

```html
<template>
    <div>
        {{ time | formatTime('YYYY-MM-DD') }}
        {{ time1 }}
        {{ time2 }}
    </div>
</template>

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
```

## Documentation

待加入

## Contribution

If you find a bug or want to contribute to the code or documentation, you can help by submitting an [issue](https://github.com/pagekit/tt-utils/issues) or a [pull request](https://github.com/pagekit/tt-utils/pulls).

## License

[MIT](http://opensource.org/licenses/MIT)
