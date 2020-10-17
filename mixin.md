# nextTick

> mixin混入核心源码

## 官网介绍

> https://cn.vuejs.org/v2/api/#Vue-nextTick

## 核心代码

```js

Vue.mixin = function(mixin){
    // mergeOptions,第三方库提供的一个合并对象的方法,类似与webpack的merge
    this.options = mergeOptions(this.options, mixin);
    return this;
}
// 根据mixin的功能思考mergeOptions的源码
// 对于对象属性,data,methods等属性,有重复时,以组件属性为准
// 对于函数属性,生命周期钩子函数,两者都触发,先触发mixin的,再触发组件的
/**
 * 混入选项
 * @param {*} base 
 * @param {*} mixin 
 */
function mergeOptions(base, mixin){
    for (const key in mixin) {
        const option = mixin[key];
        console.log(option);
        if(typeof(option) === 'object'){
            for (const prop in option) {
                console.log(prop);
                if(!base[key].hasOwnProperty(prop)){
                    base[key][prop] = option[prop];
                }
            }
        }else if(typeof(option) === 'function'){
            const baseOp = base[key];
            base[key] = function(){
                // 先执行mixin的
                option.call(this);
                // 在执行组件自己的
                baseOp.call(this);
            }
        }
    }
    return base;
}

const base = {
    data: {
        a: 1,
        b: 2
    },
    mounted(){
        console.log('component');
    }
}

const mixin = {
    data: {
        a: 2,
        c: 3,
    },
    mounted(){
        console.log('mixin');
    }
}

mergeOptions(base, mixin);
console.log(base);
```

## 完整源码

```ts
/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```