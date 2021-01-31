<!--
 * @Author: zyxm5
 * @Date: 2021-01-25 06:50:59
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-25 13:57:27
 * @Description: Vue.util.extend源码分析
-->
# Vue.util.extend

> 合并对象,谨慎使用

# 官网介绍

> 无

# 核心代码

```js
/**
 * Mix properties into target object.
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
```

# 完整源码

```js
/**
 * Mix properties into target object.
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
```
