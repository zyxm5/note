<!--
 * @Author: zyxm5
 * @Date: 2021-01-25 06:55:25
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-25 09:42:03
 * @Description: observable源码分析
-->
# observable

> 观察对象变化(2.6新增)

# 官网介绍

> https://cn.vuejs.org/v2/api/#Vue-observable

# 核心代码

```js
Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
```

# 完整源码

```js
Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
```
