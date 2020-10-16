/**
 * 数据响应式
 * @param {*} obj 
 * @param {*} key 
 * @param {*} val 
 */
function defineReactive(obj, key, val) {
    if (arguments.length === 2) {
        val = obj[key];
    }
    observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val;
        },
        set: function (newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            observe(newVal);
            render();
        }
    })
}
/**
 * 监听数据变化
 * @param {*} val 
 */
function observe(val) {
    console.log(val);
    if (typeof val != 'object' || val == null) {
        return;
    }
    if (Array.isArray(val)) {
        val.__proto__ = arrayMethods;
        observeArray(val)
    } else {
        observeObject(val);
    }
}
// 构建数组的7个变异函数
const ArrayProto = Array.prototype;
const arrayMethods = Object.create(ArrayProto);
const variaMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
variaMethods.forEach(method => {
    const originMethod = arrayMethods[method];
    arrayMethods[method] = function () {
        const result = originMethod.apply(this, arguments);
        render();
        return result;
    }
})

/**
 * 监听数组变化
 * @param {*} arr 
 */
function observeArray(arr) {
    for (const item of arr) {
        observe(item);
    }
}

/**
 * 监听对象变化
 * @param {*} obj 
 */
function observeObject(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            defineReactive(obj, key);
        }
    }
}

function render() {
    console.log('render');
}

const vm = {}
const data = {
    a: 'a',
    b: {
        c: 'c'
    },
    d: [1, 2]
}
defineReactive(vm, 'data', data);