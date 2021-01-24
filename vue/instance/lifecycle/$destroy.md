<!--
 * @Author: zyxm5
 * @Date: 2021-01-21 06:37:17
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-21 06:46:13
 * @Description: $destroy源码分析
-->

# \$destroy

> 销毁 Vue 实例

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-destroy

# 核心代码

```js
Vue.prototype.$destroy = function () {
    const vm: Component = this;
    // 判断是否正在被销毁
    if (vm._isBeingDestroyed) {
        return;
    }
    // 触发beforeDestroy
    callHook(vm, "beforeDestroy");
    // 正在被销毁
    vm._isBeingDestroyed = true;
    // 从父组件中移除
    const parent = vm.$parent;
    // 父组件没有正在被销毁，且父组件不是内置组件
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
    }
    // 清空所有订阅
    if (vm._watcher) {
        vm._watcher.teardown();
    }
    let i = vm._watchers.length;
    while (i--) {
        vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.|**|
    if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
    }
    // 已销毁
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // 触发destroyed
    callHook(vm, "destroyed");
    // 移除所有事件监听
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
        vm.$el.__vue__ = null;
    }
    // release circular reference (#6759) |**|
    if (vm.$vnode) {
        vm.$vnode.parent = null;
    }
};
```

# 完整源码

```js
Vue.prototype.$destroy = function () {
    const vm: Component = this;
    if (vm._isBeingDestroyed) {
        return;
    }
    callHook(vm, "beforeDestroy");
    vm._isBeingDestroyed = true;
    // remove self from parent
    const parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
        vm._watcher.teardown();
    }
    let i = vm._watchers.length;
    while (i--) {
        vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, "destroyed");
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
        vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
        vm.$vnode.parent = null;
    }
};
```
