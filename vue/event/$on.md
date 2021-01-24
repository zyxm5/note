<!--
 * @Author: zyxm5
 * @Date: 2021-01-12 06:27:37
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-20 19:30:42
 * @Description: $on源码解析
-->

# $on

> 注册事件

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-on

# 核心代码

```js
Vue.prototype.$on = function (event, fn) {
    const vm: Component = this;
    // 处理数组的情况
    if (Array.isArray(event)) {
        // 遍历，分别注册
        for (let i = 0, l = event.length; i < l; i++) {
            vm.$on(event[i], fn);
        }
    } else {
        // 保存到数组中，作为实例的_events属性
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        // 这里是一个优化，具体是啥目前不清楚 |**|
        if (hookRE.test(event)) {
            vm._hasHookEvent = true;
        }
    }
    return vm;
};
```

# 完整源码

```js
Vue.prototype.$on = function (
    event: string | Array<string>,
    fn: Function
): Component {
    const vm: Component = this;
    if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
            vm.$on(event[i], fn);
        }
    } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
            vm._hasHookEvent = true;
        }
    }
    return vm;
};
```
