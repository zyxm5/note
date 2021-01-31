<!--
 * @Author: zyxm5
 * @Date: 2020-10-17 14:30:15
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-25 13:18:28
 * @Description: use源码分析
-->
# nextTick

> vue的扩展插件原理

## 官网介绍

> https://cn.vuejs.org/v2/api/#Vue-nextTick

## 核心代码

```js
function use(Vue){
    Vue.use = function(plugin){
        // 查看缓存
        const installedPlugins = this.installedPlugins || []; 
        // 只安装一次
        if(installedPlugins.indexOf(plugin) > -1){
            return this;
        }
        // 收集参数
        const args = Array.prototype.slice.call(arguments, 1);
        // 将Vue放入参数的第一位
        args.unshift(this);
        // 判断是否有install方法或者plugin本身就是一个方法
        if(typeof plugin.install === 'function'){
            plugin.install.apply(plugin, args)
        }else if(typeof plugin === 'function'){
            plugin.apply(null, args);
        }
        // 记录已经安装的plugin
        this.installedPlugins.push(plugin);
        return this;
    }
}
```

## 完整源码

```ts
/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}

```
