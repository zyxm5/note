<!--
 * @Author: zyxm5
 * @Date: 2021-01-20 08:45:24
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-20 10:36:53
 * @Description: file content
-->

# $set

> 响应式地添加值，并且该值也是响应式的

# 官网介绍

> https://cn.vuejs.org/v2/api/#Vue-set

# 核心代码

```js
function set(target, key, val) {
    // undefined，null，原始值直接return
    if (isUndef(target) || isPrimitive(target)) {
        return;
    }
    // 处理数组（*）
    if (Array.isArray(target)) {
        target.splice(key, 1, val);
        return val;
    }
    // 处理target中已存在key
    if (key in target) {
        target[key] = val;
        return val;
    }
    const ob = target.__ob__;
    // 不处理Vue实例和Vue实例的根数据对象
    if (target._isVue || (ob && ob.vmCount)) {
        return val;
    }
    // 处理target不是Observer的情况
    if(!ob){
        target[key] = val;
        return val;
    }
    // 处理target是已经observe的情况（大多数都是这种情况*）
    defineReactive(ob.value, key, val);
    // 通知订阅列表
    ob.dep.notify();
    return val;
}
```

# 完整源码

```ts
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set(target: Array<any> | Object, key: any, val: any): any {
    if (
        process.env.NODE_ENV !== "production" &&
        (isUndef(target) || isPrimitive(target))
    ) {
        warn(
            `Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`
        );
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    const ob = (target: any).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== "production" &&
            warn(
                "Avoid adding reactive properties to a Vue instance or its root $data " +
                    "at runtime - declare it upfront in the data option."
            );
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
}
```
