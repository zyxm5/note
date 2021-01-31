<!--
 * @Author: zyxm5
 * @Date: 2020-10-17 14:57:10
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-25 13:19:57
 * @Description: mixin源码分析
-->
# mixin

> mixin混入核心源码

## 官网介绍

> https://cn.vuejs.org/v2/api/#Vue-mixin

## 核心代码

```js

Vue.mixin = function(mixin){
    // mergeOptions,详见Vue.util.mergeOptions
    this.options = mergeOptions(this.options, mixin);
    return this;
}
```

## 完整源码

```ts
/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```