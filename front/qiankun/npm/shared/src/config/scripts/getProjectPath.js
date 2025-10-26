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
module.exports = { getProjectPath };