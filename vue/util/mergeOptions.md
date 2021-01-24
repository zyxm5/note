<!--
 * @Author: zyxm5
 * @Date: 2021-01-21 09:54:11
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-22 06:36:30
 * @Description: mergeOptions源码分析
-->

# mergeOptions

> 合并两个 Vue 选项，并返回一个新的选项

# 官网介绍

> 无

# 核心代码

```js
// 选项的合并策略
const strats = config.optionMergeStrategies;
// el,propsData 直接覆盖
strats.el = strats.propsData = defaultStrat;
// data 对于组件来说必须是函数,以自己的为基准，纯对象递归合并
strats.data = function (
    parentVal: any,
    childVal: any,
    vm?: Component
): ?Function {
    if (!vm) {
        if (childVal && typeof childVal !== "function") {
            process.env.NODE_ENV !== "production" &&
                warn(
                    'The "data" option should be a function ' +
                        "that returns a per-instance value in component " +
                        "definitions.",
                    vm
                );

            return parentVal;
        }
        return mergeDataOrFn(parentVal, childVal);
    }

    return mergeDataOrFn(parentVal, childVal, vm);
};
// 生命周期钩子 合并为数组,自己的放后面,去重
[
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestroy",
    "destroyed",
    "activated",
    "deactivated",
    "errorCaptured",
    "ssrPrefetch"
].forEach((hook) => {
    strats[hook] = mergeHook;
});
// components,directives,filters 必须是对象,以父级为原型合并自己的属性
[("component", "directive", "filter")].forEach(function (type) {
    strats[type + "s"] = mergeAssets;
});

// watch 必须是对象,先合入父级属性,再合入自己的,对于相同属性放入数组中
strats.watch = function (
    parentVal: ?Object,
    childVal: ?Object,
    vm?: Component,
    key: string
): ?Object {
    if (!childVal) return Object.create(parentVal || null);
    if (!parentVal) return childVal;
    const ret = {};
    // 先合入parentVal
    extend(ret, parentVal);
    for (const key in childVal) {
        let parent = ret[key];
        const child = childVal[key];
        // 对于相同key合并为数组处理,parent在前
        if (parent && !Array.isArray(parent)) {
            parent = [parent];
        }
        ret[key] = parent
            ? parent.concat(child)
            : Array.isArray(child)
            ? child
            : [child];
    }
    return ret;
};

// props,methods,inject,computed 先合入父级,再合入自己,直接覆盖
strats.props = strats.methods = strats.inject = strats.computed = function (
    parentVal: ?Object,
    childVal: ?Object,
    vm?: Component,
    key: string
): ?Object {
    if (!parentVal) return childVal;
    const ret = Object.create(null);
    // 先合入parentVal
    extend(ret, parentVal);
    // 再合入childVal
    if (childVal) extend(ret, childVal);
    return ret;
};
// provide 和data相同,唯一区别,不要求data是函数
strats.provide = mergeDataOrFn;
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(
    parent: Object,
    child: Object,
    vm?: Component
): Object {
    if (typeof child === "function") {
        child = child.options;
    }
    // 规范化props =>
    // {
    //     a: {type:?,...},
    //     b: {type:?,...}
    // }
    normalizeProps(child, vm);
    // 规范化inject =>
    // {
    //     a: {
    //         from: a,
    //         ...
    //     },
    //     b: {
    //         from: b
    //     }
    // }
    normalizeInject(child, vm);
    // 规范化directive =>
    // {
    //     a: {
    //         bind(){},
    //         update(){},
    //         ...
    //     },
    //     b: {
    //         bind(){},
    //         update(){},
    //         ...
    //     }
    // }
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
        // 递归merge extends选项
        if (child.extends) {
            parent = mergeOptions(parent, child.extends, vm);
        }
        // 递归merge mixins选项
        if (child.mixins) {
            for (let i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
    }

    const options = {};
    let key;
    for (key in parent) {
        mergeField(key);
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options: Object, vm: ?Component) {
    const props = options.props;
    if (!props) return;
    const res = {};
    let i, val, name;
    // 数组：props: ['a','b']
    if (Array.isArray(props)) {
        i = props.length;
        while (i--) {
            val = props[i];
            if (typeof val === "string") {
                // 小驼峰化
                name = camelize(val);
                res[name] = { type: null };
            } else if (process.env.NODE_ENV !== "production") {
                warn("props must be strings when using array syntax.");
            }
        }
    }
    // 对象：
    // props: {
    //     a: String,
    //     b: Number
    // },
    // props: {
    //     a:{
    //         type: String
    //     },
    //     b:{
    //         type: Number
    //     }
    // }
    else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key];
            name = camelize(key);
            res[name] = isPlainObject(val) ? val : { type: val };
        }
    } else if (process.env.NODE_ENV !== "production") {
        warn(
            `Invalid value for option "props": expected an Array or an Object, ` +
                `but got ${toRawType(props)}.`,
            vm
        );
    }
    options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options: Object, vm: ?Component) {
    const inject = options.inject;
    if (!inject) return;
    const normalized = (options.inject = {});
    // 无论是数组还是对象，最终都会被转换成对象，且该对象至少包含一个属性from指向key值
    if (Array.isArray(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = { from: inject[i] };
        }
    } else if (isPlainObject(inject)) {
        for (const key in inject) {
            const val = inject[key];
            normalized[key] = isPlainObject(val)
                ? extend({ from: key }, val)
                : { from: val };
        }
    } else if (process.env.NODE_ENV !== "production") {
        warn(
            `Invalid value for option "inject": expected an Array or an Object, ` +
                `but got ${toRawType(inject)}.`,
            vm
        );
    }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options: Object) {
    const dirs = options.directives;
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key];
            // 如果是函数则直接赋值给bind和update钩子
            if (typeof def === "function") {
                dirs[key] = { bind: def, update: def };
            }
        }
    }
}

/**
 * Default strategy.
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
    return childVal === undefined ? parentVal : childVal;
};
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to: Object, from: ?Object): Object {
    if (!from) return to;
    let key, toVal, fromVal;

    const keys = Object.keys(from);

    for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            set(to, key, fromVal);
        } else if (
            toVal !== fromVal &&
            isPlainObject(toVal) &&
            isPlainObject(fromVal)
        ) {
            // 对于纯对象
            // 递归处理下一层
            mergeData(toVal, fromVal);
        }
    }
    return to;
}
/**
 * Data
 */
export function mergeDataOrFn(
    parentVal: any,
    childVal: any,
    vm?: Component
): ?Function {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal;
        }
        if (!parentVal) {
            return childVal;
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData(
                typeof childVal === "function"
                    ? childVal.call(this, this)
                    : childVal,
                typeof parentVal === "function"
                    ? parentVal.call(this, this)
                    : parentVal
            );
        };
    } else {
        return function mergedInstanceDataFn() {
            // instance merge
            const instanceData =
                typeof childVal === "function"
                    ? childVal.call(vm, vm)
                    : childVal;
            const defaultData =
                typeof parentVal === "function"
                    ? parentVal.call(vm, vm)
                    : parentVal;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            } else {
                return defaultData;
            }
        };
    }
}
/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(
    parentVal: ?Array<Function>,
    childVal: ?Function | ?Array<Function>
): ?Array<Function> {
    const res = childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : Array.isArray(childVal)
            ? childVal
            : [childVal]
        : parentVal;
    return res ? dedupeHooks(res) : res;
}
// 去重
function dedupeHooks(hooks) {
    const res = [];
    for (let i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
        }
    }
    return res;
}
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(
    parentVal: ?Object,
    childVal: ?Object,
    vm?: Component,
    key: string
): Object {
    // 以parentVal为原型创建
    const res = Object.create(parentVal || null);
    if (childVal) {
        // 合并childVal的所有属性
        return extend(res, childVal);
    } else {
        return res;
    }
}
```

# 完整源码

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(
    parent: Object,
    child: Object,
    vm?: Component
): Object {
    if (process.env.NODE_ENV !== "production") {
        checkComponents(child);
    }

    if (typeof child === "function") {
        child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
        if (child.extends) {
            parent = mergeOptions(parent, child.extends, vm);
        }
        if (child.mixins) {
            for (let i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
    }

    const options = {};
    let key;
    for (key in parent) {
        mergeField(key);
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options: Object, vm: ?Component) {
    const props = options.props;
    if (!props) return;
    const res = {};
    let i, val, name;
    if (Array.isArray(props)) {
        i = props.length;
        while (i--) {
            val = props[i];
            if (typeof val === "string") {
                name = camelize(val);
                res[name] = { type: null };
            } else if (process.env.NODE_ENV !== "production") {
                warn("props must be strings when using array syntax.");
            }
        }
    } else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key];
            name = camelize(key);
            res[name] = isPlainObject(val) ? val : { type: val };
        }
    } else if (process.env.NODE_ENV !== "production") {
        warn(
            `Invalid value for option "props": expected an Array or an Object, ` +
                `but got ${toRawType(props)}.`,
            vm
        );
    }
    options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options: Object, vm: ?Component) {
    const inject = options.inject;
    if (!inject) return;
    const normalized = (options.inject = {});
    if (Array.isArray(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = { from: inject[i] };
        }
    } else if (isPlainObject(inject)) {
        for (const key in inject) {
            const val = inject[key];
            normalized[key] = isPlainObject(val)
                ? extend({ from: key }, val)
                : { from: val };
        }
    } else if (process.env.NODE_ENV !== "production") {
        warn(
            `Invalid value for option "inject": expected an Array or an Object, ` +
                `but got ${toRawType(inject)}.`,
            vm
        );
    }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options: Object) {
    const dirs = options.directives;
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key];
            if (typeof def === "function") {
                dirs[key] = { bind: def, update: def };
            }
        }
    }
}
```
