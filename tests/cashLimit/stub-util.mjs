// utils/util.js 的测试桩：只实现 cashLimit.js 用到的那几个方法。
// 用一个模块级对象模拟 storage，测试里可以直接断言它的内容。
const mem = {};

export default {
  getStorage: (k) => (k in mem ? mem[k] : null),
  setStorage: (k, v) => { mem[k] = v; },
  removeStorage: (k) => { delete mem[k]; },
  // 测试辅助：清空内存 store，避免用例之间互相污染
  __reset: () => { Object.keys(mem).forEach(k => delete mem[k]); }
};
