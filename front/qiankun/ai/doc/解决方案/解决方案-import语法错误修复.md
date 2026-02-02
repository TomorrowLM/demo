# JavaScript Import语法错误解决方案

## 问题描述
在VSCode中，`packages/react-demo/src/utils/request.js` 文件显示错误：
```
Parsing error: The keyword 'import' is reserved
```

## 问题分析

经过详细分析，发现以下问题：

### 1. ESLint配置问题
`.eslintrc.js` 中关键的解析器选项被注释掉了：
```javascript
// parserOptions: {
//   ecmaVersion: 2015, // 或更高版本
//   sourceType: 'module'
// },
```

### 2. VSCode语言服务配置缺失
`.vscode/settings.json` 缺少JavaScript/TypeScript语言服务的相关配置。

### 3. 项目配置不一致
虽然项目有完整的Babel和Webpack配置，但IDE层面的配置不完整。

## 解决方案

### 方案1：修复ESLint配置（推荐）

修改 `.eslintrc.js` 文件：

```javascript
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020, // 支持ES2020语法
    sourceType: 'module', // 启用ES6模块
    ecmaFeatures: {
      jsx: true // 支持JSX
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    semi: [0, "never"]
  }
}
```

### 方案2：更新VSCode工作区配置

修改 `.vscode/settings.json`，添加以下配置：

```json
{
  "workbench.colorCustomizations": {
    "activityBar.activeBackground": "#85a887",
    "activityBar.background": "#85a887",
    "activityBar.foreground": "#e7e7e7",
    "activityBar.inactiveForeground": "#e7e7e799",
    "activityBarBadge.background": "#25320e",
    "activityBarBadge.foreground": "#e7e7e7",
    "commandCenter.border": "#e7e7e799",
    "sash.hoverBorder": "#93d496",
    "statusBar.background": "#85a887",
    "statusBar.foreground": "#e7e7e7",
    "statusBarItem.hoverBackground": "#93d496",
    "statusBarItem.remoteBackground": "#93d496",
    "statusBarItem.remoteForeground": "#e7e7e7",
    "titleBar.activeBackground": "#85a887",
    "titleBar.activeForeground": "#e7e7e7",
    "titleBar.inactiveBackground": "#85a887",
    "titleBar.inactiveForeground": "#e7e7e799"
  },
  "peacock.color": "#832561",
  "javascript.validate.enable": true,
  "typescript.validate.enable": true,
  "javascript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [
    "packages/react-demo"
  ]
}
```

### 方案3：为react-demo子项目添加模块类型声明

在 `packages/react-demo/package.json` 中添加：

```json
{
  "name": "react-app",
  "version": "1.0.0",
  "type": "module",
  // ... 其他配置保持不变
}
```

**注意：** 由于项目使用CommonJS的webpack配置，建议不使用此方案，而是通过ESLint配置解决。

### 方案4：创建jsconfig.json（备选方案）

在 `packages/react-demo/` 目录下创建 `jsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "allowJs": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 推荐执行顺序

1. **首先执行方案1**：修复ESLint配置，这是最根本的解决方案
2. **然后执行方案2**：更新VSCode工作区配置，提供更好的IDE支持
3. **如果问题仍然存在**：执行方案4，创建jsconfig.json文件

## 验证步骤

1. 重启VSCode
2. 检查 `packages/react-demo/src/utils/request.js` 文件是否还有错误提示
3. 验证其他使用import语法的文件是否正常
4. 运行 `npm run serve:qiankun` 确保项目能正常启动

## 根本原因

这个问题的根本原因是IDE的JavaScript解析器默认使用ES5标准，不支持ES6的import语法。通过配置ESLint的parserOptions或创建jsconfig.json，可以告诉IDE使用更新的ECMAScript标准来解析JavaScript文件。

## 预防措施

1. 在新项目中始终配置完整的ESLint规则
2. 为JavaScript项目创建jsconfig.json或为TypeScript项目创建tsconfig.json
3. 在VSCode工作区配置中明确指定语言服务设置