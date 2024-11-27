const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, '../routes'); // 替换为你的文件目录
console.log(fs.readdirSync(filePath),1);

const getFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getFiles(name)] : [...files, name];
  }, []);

const importAll = (filePath) => {
  const files = getFiles(filePath);
  const modules = {
    'common': []
  };
  for (const file of files) {
    if (file.endsWith('.js')) {
      Object.keys(modules).forEach(val => {
        if (file.includes(val)) {
          modules[val].push({
            path: `/${val}/${path.basename(file, '.js')}`,
            importVal: require(file)
          })
        }
      })

      // const file = '123'
      // const [file] = await require(file);
      // modules.push(module);
    }
  }
  return modules;
};

const routes = importAll(filePath)
const commonPath = routes.common.map(val=>val.path)
console.log('routes:',routes,commonPath);

module.exports = {
  routes,
  commonPath
}
