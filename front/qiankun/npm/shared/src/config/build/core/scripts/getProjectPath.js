// 获取项目路径
function getProjectPath() {
  const fs = require('fs');
  const path = require('path');

  let dir = process.cwd();
  console.log('getProjectPath: 当前运行项目路径', dir);
  const root = path.parse(dir).root;

  while (true) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        // 如果是 shared 包自己，继续向上查找；否则返回项目 info
        if (pkg.name !== '@lm/shared') {
          return { root: dir, name: pkg.name || '', packageJson: pkg };
        }
      } catch (e) {
        // 忽略 package.json 解析错误，继续向上查找
      }
    }

    if (dir === root) break;
    dir = path.dirname(dir);
  }

  return null;
}
function paths() {
  return {
    appRoot: process.cwd(),
    resolveApp: (...segs) => path.resolve(process.cwd(), ...segs),
    resolveSrcDir: () => path.resolve(process.cwd(), 'src'),
    getPublicPath: (v, fallback = '/') => {
      const ensureSlash = (p, needsSlash) => {
        const has = p.endsWith('/')
        if (has && !needsSlash) return p.slice(0, -1)
        if (!has && needsSlash) return p + '/'
        return p
      }
      const val = v ?? process.env.PUBLIC_PATH ?? fallback
      return ensureSlash(val, true)
    },
  }
}
module.exports = { getProjectPath };