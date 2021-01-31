<!--
 * @Author: zyxm5
 * @Date: 2021-01-31 16:27:11
 * @LastEditors: zyxm5
 * @LastEditTime: 2021-01-31 16:39:19
 * @Description: props配置解析
-->

# props

> 无

# 官网介绍

> https://cn.vuejs.org/v2/guide/components-props.html

# 核心代码

```js
/**
 * 最终都会将props配置解析为对象格式
 */
function normalizeProps(options: Object, vm: ?Component) {
    const props = options.props;
    if (!props) return;
    const res = {};
    let i, val, name;
    // 数组配置[name1,name2] =>
    //   {
    //       name1:{
    //           type: null
    //       },
    //       name2: {
    //           type: null
    //       }
    //   }
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
    } 
    // 对象配置
    // {
    //     name1: Boolean,
    //     name2: {
    //         tpye: String,
    //         default: 'name2'
    //     }
    // } =>
    // {
    //     name1: {
    //         type: Boolean
    //     },
    //     name2: {
    //         type: String,
    //         default: 'name2'
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
```
