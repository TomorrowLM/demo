# 全局环境变量配置指南

## 概述

本项目现在使用共享的环境配置系统，通过 `@lm/shared` 包来管理全局环境变量。这样可以实现：

1. **多个项目共用**：所有项目都可以使用相同的环境配置
2. **在线编辑同步**：修改共享配置后，所有项目会自动更新
3. **类型安全**：支持 TypeScript 类型定义
4. **环境区分**：自动根据 NODE_ENV 加载不同的配置

## 配置结构

### 共享环境配置 (`@lm/shared/src/config/env.ts`)

包含以下配置项：

```typescript
interface AppConfig {
  // 应用信息
  APP_NAME: string;           // 应用名称
  APP_VERSION: string;        // 应用版本
  
  // 环境标识
  IS_DEVELOPMENT: boolean;    // 是否是开发环境
  IS_PRODUCTION: boolean;     // 是否是生产环境
  IS_TEST: boolean;           // 是否是测试环境
  
  // 构建信息
  BUILD_TIME: string;         // 构建时间
  GIT_COMMIT: string;         // Git Commit Hash
  GIT_BRANCH: string;         // Git 分支
  
  // API 配置
  API_BASE_URL: string;       // API 基础地址
  WS_BASE_URL: string;        // WebSocket 地址
  CDN_BASE_URL: string;       // CDN 地址
  
  // 调试配置
  DEBUG: boolean;             // 调试模式
  
  // 环境
  ENV: string;                // 当前环境
}
```

### 环境特定配置

- **开发环境** (`development`): 使用本地服务器地址
- **生产环境** (`production`): 使用线上服务器地址  
- **测试环境** (`test`): 使用测试服务器地址

## 使用方法

### 1. 在代码中使用全局变量

```javascript
// 直接使用全局变量
console.log('应用名称:', AppConfig.APP_NAME);
console.log('API地址:', AppConfig.API_BASE_URL);
console.log('是否是开发环境:', AppConfig.IS_DEVELOPMENT);

// 条件编译
if (AppConfig.IS_DEVELOPMENT) {
  // 开发环境特定逻辑
  console.log('开发模式调试信息');
}

if (AppConfig.DEBUG) {
  // 调试模式逻辑
  console.log('调试信息:', AppConfig);
}
```

### 2. 使用工具函数

```javascript
import { useAppConfig, logEnvironmentInfo } from '@/utils/env-demo';

// 获取配置对象
const config = useAppConfig();
console.log(config.appName, config.apiBaseUrl);

// 打印环境信息
logEnvironmentInfo();
```

### 3. 在 React 组件中使用

```jsx
import React from 'react';

function AppInfo() {
  return (
    <div>
      <h1>{AppConfig.APP_NAME}</h1>
      <p>版本: {AppConfig.APP_VERSION}</p>
      <p>环境: {AppConfig.ENV}</p>
      <p>构建时间: {AppConfig.BUILD_TIME}</p>
      
      {AppConfig.IS_DEVELOPMENT && (
        <div className="dev-banner">开发环境</div>
      )}
    </div>
  );
}
```

## 自定义配置

### 修改共享配置

编辑 `npm/shared/src/config/env.ts` 文件：

```typescript
// 添加自定义配置
const baseConfig: Partial<AppConfig> = {
  // ... 原有配置
  CUSTOM_FEATURE: true,
  MAX_ITEMS: 100,
};

// 环境特定配置
const envConfigs: Record<string, Partial<AppConfig>> = {
  development: {
    // ... 原有配置
    CUSTOM_FEATURE: true,
    MAX_ITEMS: 50,
  },
  production: {
    // ... 原有配置  
    CUSTOM_FEATURE: false,
    MAX_ITEMS: 100,
  },
};
```

### 重新构建共享包

修改配置后需要重新构建：

```bash
cd npm/shared
npm run build:esm
```

### 在项目中使用自定义配置

```javascript
// 使用自定义配置
if (AppConfig.CUSTOM_FEATURE) {
  // 自定义功能逻辑
}

const maxItems = AppConfig.MAX_ITEMS;
```

## 构建时注入变量

可以在 package.json 脚本中注入变量：

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production GIT_COMMIT=$(git rev-parse --short HEAD) GIT_BRANCH=$(git branch --show-current) webpack --config webpack.prod.js"
  }
}
```

## 注意事项

1. **全局变量**: 通过 webpack DefinePlugin 注入，在代码中直接使用 `AppConfig.XXX`
2. **类型支持**: 支持 TypeScript 类型检查
3. **环境敏感**: 配置会根据 `NODE_ENV` 自动切换
4. **构建更新**: 修改共享配置后需要重新构建共享包
5. **浏览器访问**: 配置也会挂载到 `window.__APP_CONFIG__` 供调试使用

## 调试技巧

```javascript
// 在浏览器控制台查看完整配置
console.log(window.__APP_CONFIG__);

// 检查特定配置
console.log('当前API地址:', AppConfig.API_BASE_URL);
console.log('调试模式:', AppConfig.DEBUG);
```

这样配置后，所有项目都可以共享同一套环境配置，修改一处即可同步到所有项目。
