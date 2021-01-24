<!--
 * @Author: zyxm5
 * @Date: 2021-01-21 06:27:34
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-21 06:36:53
 * @Description: $forceUpdate源码分析
-->

# \$forceUpdate

> 强制更新一次

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-forceUpdate

# 核心代码

```js
Vue.prototype.$forceUpdate = function () {
    const vm: Component = this;
    // 如果组件需要渲染
    if (vm._watcher) {
        // 更新watcher
        vm._watcher.update();
    }
};
```

# 完整源码

```js
Vue.prototype.$forceUpdate = function () {
    const vm: Component = this;
    if (vm._watcher) {
        vm._watcher.update();
    }
};
```
