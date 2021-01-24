<!--
 * @Author: zyxm5
 * @Date: 2021-01-20 11:03:54
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-20 19:19:15
 * @Description: $watch源码解析
-->

# \$watch

> 观察 Vue 实例上的一个表达式或者函数的返回结果的变化

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-watch

# 核心代码

```js
Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this;
    // 处理传递配置对象的情况，回调作为配置对象的handler属性
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    const watcher = new Watcher(vm, expOrFn, cb, options);
    // 如果配置了immediate，则立即执行handler
    if (options.immediate) {
        try {
            // 当前值作为参数
            cb.call(vm, watcher.value);
        } catch (error) {
            handleError(
                error,
                vm,
                `callback for immediate watcher "${watcher.expression}"`
            );
        }
    }
    // 返回一个函数，用于停止watch
    return function unwatchFn() {
        // 清空watcher的订阅列表
        watcher.teardown();
    };
};
function createWatcher(vm, expOrFn, handler, options) {
    // 取出配置对象中的handler
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    // 处理handler为string的情况，将实例中的methods作为handler
    if (typeof handler === "string") {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}
```

# 完整源码

```js
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
): Function {
    const vm: Component = this;
    if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    const watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
        try {
            cb.call(vm, watcher.value);
        } catch (error) {
            handleError(
                error,
                vm,
                `callback for immediate watcher "${watcher.expression}"`
            );
        }
    }
    return function unwatchFn() {
        watcher.teardown();
    };
};
function createWatcher(
    vm: Component,
    expOrFn: string | Function,
    handler: any,
    options?: Object
) {
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === "string") {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}
```
