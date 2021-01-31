<!--
 * @Author: zyxm5
 * @Date: 2021-01-25 06:33:08
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-25 06:48:26
 * @Description: Vue.util.warn源码分析
-->

# Vue.util.warn

> Vue 警告,谨慎使用

# 官网介绍

> 无

# 核心代码

```js
export let warn = noop;
export let generateComponentTrace = (noop: any) // work around flow check
export let formatComponentName = (noop: any)
if (process.env.NODE_ENV !== "production") {
    const hasConsole = typeof console !== "undefined";
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = (str) =>
        str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
    warn = (msg, vm) => {
        const trace = vm ? generateComponentTrace(vm) : "";

        if (config.warnHandler) {
            config.warnHandler.call(null, msg, vm, trace);
        } else if (hasConsole && !config.silent) {
            console.error(`[Vue warn]: ${msg}${trace}`);
        }
    };
}
generateComponentTrace = (vm) => {
    if (vm._isVue && vm.$parent) {
        const tree = [];
        let currentRecursiveSequence = 0;
        while (vm) {
            if (tree.length > 0) {
                const last = tree[tree.length - 1];
                if (last.constructor === vm.constructor) {
                    currentRecursiveSequence++;
                    vm = vm.$parent;
                    continue;
                } else if (currentRecursiveSequence > 0) {
                    tree[tree.length - 1] = [last, currentRecursiveSequence];
                    currentRecursiveSequence = 0;
                }
            }
            tree.push(vm);
            vm = vm.$parent;
        }
        return (
            "\n\nfound in\n\n" +
            tree
                .map(
                    (vm, i) =>
                        `${i === 0 ? "---> " : repeat(" ", 5 + i * 2)}${
                            Array.isArray(vm)
                                ? `${formatComponentName(vm[0])}... (${
                                      vm[1]
                                  } recursive calls)`
                                : formatComponentName(vm)
                        }`
                )
                .join("\n")
        );
    } else {
        return `\n\n(found in ${formatComponentName(vm)})`;
    }
};
formatComponentName = (vm, includeFile) => {
    // 如果是根节点,返回<Root>
    if (vm.$root === vm) {
        return "<Root>";
    }
    const options =
        typeof vm === "function" && vm.cid != null
            ? vm.options
            : vm._isVue
            ? vm.$options || vm.constructor.options
            : vm;
    // 获取组件/实例名称
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
    }

    return (
        (name ? `<${classify(name)}>` : `<Anonymous>`) +
        (file && includeFile !== false ? ` at ${file}` : "")
    );
};
```

# 完整源码

```js
export let warn = noop;
export let generateComponentTrace = (noop: any) // work around flow check
export let formatComponentName = (noop: any)
if (process.env.NODE_ENV !== "production") {
    const hasConsole = typeof console !== "undefined";
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = (str) =>
        str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");

    warn = (msg, vm) => {
        const trace = vm ? generateComponentTrace(vm) : "";

        if (config.warnHandler) {
            config.warnHandler.call(null, msg, vm, trace);
        } else if (hasConsole && !config.silent) {
            console.error(`[Vue warn]: ${msg}${trace}`);
        }
    };
}
generateComponentTrace = (vm) => {
    if (vm._isVue && vm.$parent) {
        const tree = [];
        let currentRecursiveSequence = 0;
        while (vm) {
            if (tree.length > 0) {
                const last = tree[tree.length - 1];
                if (last.constructor === vm.constructor) {
                    currentRecursiveSequence++;
                    vm = vm.$parent;
                    continue;
                } else if (currentRecursiveSequence > 0) {
                    tree[tree.length - 1] = [last, currentRecursiveSequence];
                    currentRecursiveSequence = 0;
                }
            }
            tree.push(vm);
            vm = vm.$parent;
        }
        return (
            "\n\nfound in\n\n" +
            tree
                .map(
                    (vm, i) =>
                        `${i === 0 ? "---> " : repeat(" ", 5 + i * 2)}${
                            Array.isArray(vm)
                                ? `${formatComponentName(vm[0])}... (${
                                      vm[1]
                                  } recursive calls)`
                                : formatComponentName(vm)
                        }`
                )
                .join("\n")
        );
    } else {
        return `\n\n(found in ${formatComponentName(vm)})`;
    }
};
formatComponentName = (vm, includeFile) => {
    if (vm.$root === vm) {
        return "<Root>";
    }
    const options =
        typeof vm === "function" && vm.cid != null
            ? vm.options
            : vm._isVue
            ? vm.$options || vm.constructor.options
            : vm;
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
    }

    return (
        (name ? `<${classify(name)}>` : `<Anonymous>`) +
        (file && includeFile !== false ? ` at ${file}` : "")
    );
};
```
