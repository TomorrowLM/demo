// vue3响应式原理：利用Proxy对象对数据拦截
const toProxy = new WeakMap(); // 形如 obj: observed
const toRaw = new WeakMap(); // 形如 observed: obj

function isObject(obj) {
  return typeof obj === "object" || obj === null;
}

function hasOwn(obj, key) {
  return obj.hasOwnProperty(key);
}

function reactive(obj) {
  if (!isObject(obj)) {
    return obj;
  }

  // 查找缓存
  if (toProxy.has(obj)) {
    return toProxy.get(obj);
  }
  // 传入obj就是代理对象,此时不用反复代理
  if (toRaw.has(obj)) {
    return obj;
  }

  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      // 访问
      const res = Reflect.get(target, key, receiver);
      console.log(`获取${key}: ${res}`);

      // 依赖收集
      track(target, key);

      return isObject(res) ? reactive(res) : res;
    },
    set(target, key, value, receiver) {
      // 新增和更新
      const hadKey = hasOwn(target, key); // ADD 或 SET
      const oldVal = target[key];
      const res = Reflect.set(target, key, value, receiver);
      if (!hadKey) {
        console.log(`新增${key}:${value}`);
        trigger(target, "ADD", key);
      } else if (oldVal !== value) {
        console.log(`设置${key}:${value}`);
        trigger(target, "SET", key);
      }
      return res;
    },
    deleteProperty(target, key) {
      // 删除
      const hadKey = hasOwn(target, key);
      const res = Reflect.deleteProperty(target, key);
      // key存在并且删除成功
      if (res && hadKey) {
        console.log(`删除${key}:${res}`);
        trigger(target, "DELETE", key);
      }
      return res;
    },
  });

  // 缓存
  toProxy.set(obj, observed);
  toRaw.set(observed, obj);

  return observed;
}

const activeReativeEffectStack = [];

// 依赖收集执行
// 基本结构{target:{key:[eff1，eff2]}}
let targetsMap = new WeakMap();

function track(target, key) {
  // 从栈中获取响应函数
  const effect = activeReativeEffectStack[activeReativeEffectStack.length - 1];
  if (effect) {
    let depsMap = targetsMap.get(target);
    if (!depsMap) {
      // 首次访问target
      depsMap = new Map();
      targetsMap.set(target, depsMap);
    }

    // 存放key
    let deps = depsMap.get(key);
    if (!deps) {
      deps = new Set();
      depsMap.set(key, deps);
    }
    if (!deps.has(effect)) {
      deps.add(effect);
    }
  }
}

function effect(fn) {
  // 1.异常处理
  // 2.执行函数
  // 3.放置到activeReativeEffectStack
  const rxEffect = function (...args) {
    try {
      activeReativeEffectStack.push(rxEffect);
      return fn(...args); // 执行函数触发依赖收集
    } finally {
      activeReativeEffectStack.pop();
    }
  };

  rxEffect(); // 默认立即执行
  return rxEffect;
}

// 触发target.key对应响应函数
function trigger(target, type, key) {
  // 获取依赖表
  const depsMap = targetsMap.get(target);
  if (depsMap) {
    // 获取响应函数集合
    const deps = depsMap.get(key);
    const effects = new Set();
    if (deps) {
      // 执行所有响应函数
      deps.forEach((effect) => {
        // effect()
        effects.add(effect);
      });
    }

    // 数组新增或删除
    if (type === "ADD" || type === "DELETE") {
      if (Array.isArray(target)) {
        const deps = depsMap.get("length");
        if (deps) {
          deps.forEach((effect) => {
            effects.add(effect);
          });
        }
      }
    }
    // 获取已存在的Dep Set执行
    effects.forEach((effect) => effect());
  }
}

const data = { foo: "foo", bar: { a: 1 } };
const react = reactive(data);
// 1.获取
// react.foo // ok
// 2.设置已存在属性
// react.foo = 'foooooooo'
// 3.设置不存在属性
// react.baz = 'bazzzzzz'
// 4.嵌套对象
// react.bar.a = 10

// 避免重复代理
// console.log(reactive(data) === react) // true
// reactive(react)
effect(() => {
  console.log("count发生了变化：", react.foo);
  // dom
});
react.foo = "fooooooo";
