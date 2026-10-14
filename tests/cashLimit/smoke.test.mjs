import test from 'node:test';
import assert from 'node:assert';
import util from '@/utils/util.js';

test('别名解析到测试桩，storage 读写可用', () => {
  util.setStorage('__smoke', { a: 1 });
  assert.deepStrictEqual(util.getStorage('__smoke'), { a: 1 });
  util.removeStorage('__smoke');
  assert.strictEqual(util.getStorage('__smoke'), null);
});
