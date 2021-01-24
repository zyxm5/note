<!--
 * @Author: zyxm5
 * @Date: 2021-01-20 10:43:09
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-20 11:01:36
 * @Description: $delete源码解析
-->

# $delete

> 响应式的删除一个属性

# 官网介绍

> https://cn.vuejs.org/v2/api/#Vue-delete

# 核心代码

```js
export function del(target, key) {
    // undefined，null，原始值直接return
    if (isUndef(target) || isPrimitive(target)) {
        return;
    }
    // 处理数组
    if (Array.isArray(target)) {
        target.splice(key, 1);
        return;
    }
    const ob = target.__ob__;
    // 不处理Vue实例和Vue实例的根数据对象
    if (target._isVue || (ob && ob.vmCount)) {
        return val;
    }
    // target中不存在key
    if (!hasOwn(target, key)) {
        return;
    }
    // 删除属性
    delete target[key];
    if (!ob) {
        // 没有被observe的对象不处理
        return;
    }
    // 通知订阅
    ob.dep.notify();
}
```

# 完整源码

```js
/**
 * Delete a property and trigger change if necessary.
 */
export function del(target: Array<any> | Object, key: any) {
    if (
        process.env.NODE_ENV !== "production" &&
        (isUndef(target) || isPrimitive(target))
    ) {
        warn(
            `Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`
        );
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1);
        return;
    }
    const ob = (target: any).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== "production" &&
            warn(
                "Avoid deleting properties on a Vue instance or its root $data " +
                    "- just set it to null."
            );
        return;
    }
    if (!hasOwn(target, key)) {
        return;
    }
    delete target[key];
    if (!ob) {
        return;
    }
    ob.dep.notify();
}
```
