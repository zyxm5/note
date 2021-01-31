<!--
 * @Author: zyxm5
 * @Date: 2021-01-20 19:40:49
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-25 06:20:11
 * @Description: $off 源码解析
-->

# $off

> 解除事件监听

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-off

# 核心代码

```js
Vue.prototype.$off = function (
    event?: string | Array<string>,
    fn?: Function
): Component {
    const vm: Component = this;
    // 如果没有传参
    if (!arguments.length) {
        // 则清空所有事件监听
        vm._events = Object.create(null);
        return vm;
    }
    // 处理数组，同$on
    if (Array.isArray(event)) {
        // 一次解绑
        for (let i = 0, l = event.length; i < l; i++) {
            vm.$off(event[i], fn);
        }
        return vm;
    }
    // 如果没有对应事件
    const cbs = vm._events[event];
    if (!cbs) {
        // 直接return
        return vm;
    }
    // 如果没有传递解绑函数
    if (!fn) {
        // 清空该事件的所有监听
        vm._events[event] = null;
        return vm;
    }
    // 指定 handler
    let cb;
    let i = cbs.length;
    while (i--) {
        cb = cbs[i];
        // 解除event的fn绑定
        // cb.fn 处理$once绑定的监听
        if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1);
            break;
        }
    }
    return vm;
};
```

# 完整源码

```js
Vue.prototype.$off = function (
    event?: string | Array<string>,
    fn?: Function
): Component {
    const vm: Component = this;
    // all
    if (!arguments.length) {
        vm._events = Object.create(null);
        return vm;
    }
    // array of events
    if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
            vm.$off(event[i], fn);
        }
        return vm;
    }
    // specific event
    const cbs = vm._events[event];
    if (!cbs) {
        return vm;
    }
    if (!fn) {
        vm._events[event] = null;
        return vm;
    }
    // specific handler
    let cb;
    let i = cbs.length;
    while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1);
            break;
        }
    }
    return vm;
};
```
