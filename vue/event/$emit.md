<!--
 * @Author: zyxm5
 * @Date: 2021-01-12 06:27:10
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-21 06:19:45
 * @Description: $emit源码解析
-->

# $emit

> 触发监听事件

# 官网介绍

> https://cn.vuejs.org/v2/api/#vm-emit

# 核心代码

```js
Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this;
    const lowerCaseEvent = event.toLowerCase();
    // tips：event格式应该为小写字母以短横线相连
    if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
            `Event "${lowerCaseEvent}" is emitted in component ` +
                `${formatComponentName(
                    vm
                )} but the handler is registered for "${event}". ` +
                `Note that HTML attributes are case-insensitive and you cannot use ` +
                `v-on to listen to camelCase events when using in-DOM templates. ` +
                `You should probably use "${hyphenate(
                    event
                )}" instead of "${event}".`
        );
    }
    // 取出所有监听函数
    let cbs = vm._events[event];
    if (cbs) {
        // 参数
        const args = toArray(arguments, 1);
        const info = `event handler for "${event}"`;
        // 依次执行监听函数
        for (let i = 0, l = cbs.length; i < l; i++) {
            invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
    }
    return vm;
};
```

# 完整源码

```js
Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this;
    if (process.env.NODE_ENV !== "production") {
        const lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
            tip(
                `Event "${lowerCaseEvent}" is emitted in component ` +
                    `${formatComponentName(
                        vm
                    )} but the handler is registered for "${event}". ` +
                    `Note that HTML attributes are case-insensitive and you cannot use ` +
                    `v-on to listen to camelCase events when using in-DOM templates. ` +
                    `You should probably use "${hyphenate(
                        event
                    )}" instead of "${event}".`
            );
        }
    }
    let cbs = vm._events[event];
    if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        const args = toArray(arguments, 1);
        const info = `event handler for "${event}"`;
        for (let i = 0, l = cbs.length; i < l; i++) {
            invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
    }
    return vm;
};
```
