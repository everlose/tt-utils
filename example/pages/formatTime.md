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
|-------- |-------------- |------ |---------------  |-------- |
| value | 时间戳 | Number | - | - |
| format | 复制完成后的回调函数 | Function | 'YYYY-MM-DD hh:mm:ss' 这样的形式 | - |


<script>
export default {
    data() {
        return {
            time: Date.now()
        };
    }
};
</script>
