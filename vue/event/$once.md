<!--
 * @Author: zyxm5
 * @Date: 2021-01-20 19:32:50
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-20 19:47:48
 * @Description: $once源码解析
-->

# $once

> 注册事件（一次后取消）

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-once

# 核心代码

```js
Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this;
    function on() {
        // 取消绑定
        vm.$off(event, on);
        // 执行函数
        fn.apply(vm, arguments);
    }
    // 这行代码没看懂 |**|
    // 目前来看就是为了区分$on和$once |><|
    on.fn = fn;
    vm.$on(event, on);
    return vm;
};
```

# 完整源码

```js
Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this;
    function on() {
        vm.$off(event, on);
        fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm;
};
```
