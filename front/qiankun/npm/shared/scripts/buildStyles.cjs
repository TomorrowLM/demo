// 将styles文件复制到shared/lib/styles目录下
// scripts/buildStyles.cjs
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src/assests');
const dependenciesDir = path.resolve(__dirname, '../lib/assets');
const destDir = path.resolve(__dirname, '../lib/assets');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(srcDir, destDir);
copyRecursive(dependenciesDir, destDir);
console.log(`Styles copied from ${srcDir} to ${destDir}`);

