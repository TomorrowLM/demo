#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

const frameworks = {
  vue: {
    description: 'Vue.js - 渐进式 JavaScript 框架',
    dependencies: {
      core: ['vue'],
      router: ['vue-router'],
      state: ['vuex'],
      ui: ['element-plus', 'ant-design-vue'],
      utils: ['axios', 'dayjs']
    },
    devDependencies: {
      build: ['@vue/cli-service'],
      types: ['@types/node'],
      plugins: ['unplugin-vue-components']
    }
  },
  react: {
    description: 'React - 用于构建用户界面的 JavaScript 库',
    dependencies: {
      core: ['react', 'react-dom'],
      router: ['react-router-dom'],
      state: ['redux', 'react-redux'],
      ui: ['antd', '@mui/material'],
      utils: ['axios', 'dayjs']
    },
    devDependencies: {
      build: ['vite', '@vitejs/plugin-react'],
      types: ['@types/react', '@types/node'],
      plugins: ['@types/react-dom']
    }
  },
  angular: {
    description: 'Angular - 平台和框架，用于构建客户端应用程序',
    dependencies: {
      core: ['@angular/core', '@angular/common'],
      router: ['@angular/router'],
      state: ['@ngrx/store'],
      ui: ['@angular/material'],
      utils: ['rxjs', 'axios']
    },
    devDependencies: {
      build: ['@angular/cli', '@angular/compiler'],
      types: ['@types/node'],
      plugins: ['@angular-devkit/build-angular']
    }
  }
};

function installPackages(packages, isDev = false) {
  if (!packages.length) return;
  const command = isDev ? 'pnpm install --save-dev' : 'pnpm install';
  const spinner = ora(`Installing packages: ${packages.join(', ')}...`).start();

  try {
    execSync(`${command} ${packages.join(' ')}`, { stdio: 'inherit' });
    spinner.succeed('Packages installed successfully!');
  } catch (error) {
    spinner.fail('Failed to install packages');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

async function promptFramework() {
  const choices = Object.entries(frameworks).map(([key, value]) => ({
    name: `${key.charAt(0).toUpperCase() + key.slice(1)} - ${value.description}`,
    value: key
  }));

  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: '请选择要使用的框架：',
      choices
    }
  ]);

  return framework;
}

async function promptDependencies(framework) {
  const frameworkConfig = frameworks[framework];
  // 将dependencyCategories定义为全局变量
  global.dependencyCategories = [
    {
      name: '核心依赖',
      key: 'core',
      type: 'dependencies'
    },
    {
      name: '路由',
      key: 'router',
      type: 'dependencies'
    },
    {
      name: '状态管理',
      key: 'state',
      type: 'dependencies'
    },
    {
      name: 'UI组件库',
      key: 'ui',
      type: 'dependencies'
    },
    {
      name: '工具库',
      key: 'utils',
      type: 'dependencies'
    },
    {
      name: '构建工具',
      key: 'build',
      type: 'devDependencies'
    },
    {
      name: '类型定义',
      key: 'types',
      type: 'devDependencies'
    },
    {
      name: '插件',
      key: 'plugins',
      type: 'devDependencies'
    }
  ];

  const questions = dependencyCategories.map(category => ({
    type: 'checkbox',
    name: category.key,
    message: `选择${category.name}：`,
    choices: frameworkConfig[category.type][category.key] || []
  }));

  const answers = await inquirer.prompt(questions);
  return answers;
}

async function main() {
  console.log(chalk.blue.bold('\n LM Web CLI - 框架依赖安装工具 \n'));

  try {
    const framework = await promptFramework();
    const selectedDependencies = await promptDependencies(framework);
    console.log(selectedDependencies, 'selectedDependencies');
    const normalDeps = [];
    const devDeps = [];

    Object.entries(selectedDependencies).forEach(([key, packages]) => {
      const category = global.dependencyCategories.find(cat => cat.key === key);
      if (category) {
        if (category.type === 'devDependencies') {
          devDeps.push(...packages);
        } else {
          normalDeps.push(...packages);
        }
      }
    });
    console.log(normalDeps,devDeps, 'normalDeps');
    if (normalDeps.length > 0) {
      await installPackages(normalDeps);
    }
    if (devDeps.length > 0) {
      await installPackages(devDeps, true);
    }

    console.log(chalk.green('\n 安装完成！\n'));
  } catch (error) {
    console.error(chalk.red('\n 安装过程中出现错误：\n'), error);
    process.exit(1);
  }
}

main();
