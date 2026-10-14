import { pathToFileURL, fileURLToPath } from 'node:url';

// 用 fileURLToPath 而非 new URL(...).pathname —— 后者在中文路径下会保留 %XX 编码，
// 且 Windows 下会产生 "C:\C:" 这类错误前缀。本仓库路径含中文（D:\SVN项目\IpadPos），
// 用 pathname 必然失败。
const repoRootPath = fileURLToPath(new URL('../../', import.meta.url));
const repoRootUrl = pathToFileURL(repoRootPath).href;

export function resolve(specifier, context, next) {
  // 把 '@/utils/util.js' 换成测试桩
  if (specifier === '@/utils/util.js') {
    return { url: new URL('stub-util.mjs', import.meta.url).href, shortCircuit: true };
  }
  // 其余 '@/xxx' 一律解析到仓库根下的实际文件
  if (specifier.startsWith('@/')) {
    return { url: repoRootUrl + specifier.slice(2), shortCircuit: true };
  }
  return next(specifier, context);
}
