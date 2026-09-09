# 项目 AI 协作规则

> 本文件由 `.qoder/rules/` 合并而来，供 GitHub Copilot 等支持 `AGENTS.md` 的工具自动读取。

---

# 一、AI 行为规则

## 变更确认规则

在执行任何代码修改之前，必须先完成以下流程：

1. **分析差异**：展示当前代码与目标的差异（如设计稿对比、需求对比等）
2. **列出方案**：列出完整的修改方案，包含要修改的文件清单和每个文件的具体变更内容
3. **等待确认**：等待用户明确确认方案后，才开始输出代码修改

禁止在未获得用户确认前直接输出修改后的代码。

### 例外情况

以下场景无需确认，可直接执行：

- 用户明确说"直接改"、"执行"、"开始"等指令
- 修复明显的语法错误或拼写错误
- 用户已在指令中给出了完整的、具体的修改内容

## 接口信息刷新规则

AI 在修改任何涉及接口调用、services、请求参数、响应字段、Swagger/OpenAPI 相关代码前，必须先调用 `get_swagger_mcp`，传入对应接口的 source 路径并设置 `refresh: true` 重新获取最新接口信息。

调用格式示例：

```
{
  source: "/dsb/yqarw/api/yqa/urban/app/event/save",
  refresh: true
}
```

## 文档同步规则

当用户说 **"sync docs"** / **"同步文档"** 时，AI 必须执行 `writing-doc` 技能 +「页面功能总结模板」。详细流程见技能内部说明。

---

# 二、代码规范

## 编码约束

### 核心原则

- 先约束再实现：写代码前明确规范边界，不要写完再补规范
- 自动化优先于文档：没有 lint/format/CI 强制执行的规范只是建议
- 不只盯格式：还要覆盖结构、复用边界、耦合和性能
- 遗留项目渐进收敛：先硬规则后软规则、先核心模块后边缘模块

### 红线

- 不写无注释函数，尤其是业务函数、工具函数和组件方法
- 不只有规范文档而缺少 lint/format/CI 强制执行
- 不在遗留项目里一次性强推全部规则
- 不把规范工作缩减成纯格式化问题
- 不忽略组件封装、复用和架构边界
- 不在框架或技术栈升级后长期放任规范过期

---

## 通用规范

1. 文件内容编码统一采用 UTF-8
2. 变量命名：驼峰式，例：`defaultConfig`
3. class 命名：小写字母+连字符
4. 业务相关命名使用中文拼音首字母相连，其余使用英文单词，例：数据采集 → `sjcj`、首页 → `home`
5. 注释解释"为什么"，而非"做了什么"
6. 文本缩进 2 个空格
7. 提交前格式化代码
8. 文件/模块名简洁描述功能业务，例：`org-manage`、`edit-cur-dept`、`personnel-list`
9. 数据为空时用 `--` 表示

---

## 代码格式化规范（Prettier + ESLint 强制执行）

以下规则由 `.prettierrc` 和 `.eslintrc.cjs` 自动强制执行，提交前必须通过格式化检查：

1. **字符串使用单引号**：`singleQuote: true`，所有 JS/TS 字符串字面量使用单引号
2. **每行最大宽度 80 字符**：`printWidth: 80`，超出时自动换行
3. **缩进 2 个空格**：`tabWidth: 2`，禁止使用 Tab 缩进
4. **语句末尾必须加分号**：`semi: true`
5. **尾逗号使用 es5 风格**：`trailingComma: "es5"`，对象和数组多行时最后一项加逗号
6. **行尾符号自动检测**：`endOfLine: "auto"`，不强制统一换行符
7. **import 自动排序**：`prettier-plugin-organize-imports` 插件自动整理 import 语句顺序
8. **package.json 自动排序**：`prettier-plugin-packagejson` 插件自动整理依赖顺序
9. **禁止在 JSX 中使用内联 `style={{}}`**：样式必须通过 Tailwind 工具类或 `.less` 文件中的 className 实现
10. **`@typescript-eslint/no-explicit-any` 为 `warn`**：尽量避免 `any`，必要时可临时使用但不忽略警告

---

## Vue 规范

1. 文件结构顺序：`<template>` → `<script>` → `<style lang="scss">`
2. 文件名使用短横线命名，例：`user-profile.vue`
3. 组件名使用 PascalCase，例：`UserProfile`
4. Props 定义必须使用驼峰命名、指定类型、添加注释
5. 自动化测试 ID 格式：`模块名-功能描述-类型`
6. 生命周期钩子顺序：name → props → data → computed → watch → created → mounted → methods

---

## HTML 规范

1. 优先使用语义化元素（header、nav、h1 等）
2. 保持代码简洁
3. 重要图片添加 alt 属性
4. 表格内重要信息添加 title 属性
5. HTML 注释格式：`<!--<div></div>-->`
6. input/button 必须添加测试用 id

---

## CSS / SCSS / LESS 规范

1. 减少 ID 选择器，避免 !important（公共样式除外）
2. 避免覆盖样式，尽量不使用行内样式
3. 多浏览器兼容时，标准属性写在底部
4. z-index ≤ 150（公共样式和提示框除外），禁止使用 999~9999
5. "0"值省略单位，例：`padding: 0 20px`
6. 每个声明以分号结束
7. 保持盒模型一致，不随意修改
8. 不改变元素默认行为
9. 不重复声明可继承样式，使用属性缩写
10. 能用英文时不用数字，例：`nth-child(odd)`
11. 颜色使用十六进制（透明效果用 rgba）
12. CSS 注释格式：`/* color: #ffffff; */`
13. **禁止**使用 `max-height`
14. **禁止**在 HTML 中使用 style

---

## JavaScript 规范

1. 避免多余逗号，例：`var arr = [1, 2, 3]`
2. 方法封装实现代码重用，避免副作用
3. 使用严格条件判断符
4. 语句以分号结束（使用 ESLint 除外）
5. 布尔变量以 `is` 开头，例：`isArray`
6. 变量声明统一放在函数起始位置
7. 条件判断使用多个 if，少用 if-else if-else
8. 循环优先使用 forEach / map
9. 尽可能减少第三方库使用

---

## TypeScript 规范

1. 使用 TypeScript 严格模式
2. 遵循组件化开发原则
3. 保持代码可读性和可维护性
4. 类型定义添加中文注释

---

## 注释规范

1. 文件注释（文件最前面）：
   ```javascript
   /**
    * @author : 作者
    * @date : 时间
    * @module : 模块名
    * @description : 模块描述
    * @version : 版本号
    */
   ```
2. 单行注释：`// `（注释符后加空格）
3. 多行注释：`/* ... */`（结束符前留空格）
4. TODO 标记：未实现功能必须标注，例：`// TODO 未处理分页`
5. 文档注释：
   ```javascript
   /**
    * 方法说明
    * @method 方法名
    * @for 所属类名
    * @param {类型} 参数名 参数说明
    * @return {类型} 返回值说明
    */
   ```

---

## 高内聚低耦合

- 组件内：组件包含与其功能相关的所有代码和资源，紧密相关
- 功能内：将特定功能的代码组织在独立模块中
- 组件间：通过 Props/Events 通信，不直接访问内部状态
- 模块间：减少依赖关系

实现方法：

1. 组件化开发：拆分为小可重用组件，每个处理单一功能
2. 单一职责原则：每个组件/模块只负责一个功能
3. 明确定义接口：使用属性、事件或函数通信
4. 依赖注入：减少硬依赖，便于替换和测试
5. 模块化开发：减少全局变量和依赖

---

# 三、项目规范

## 📦 项目结构规范

### 目录结构规范

**组件必须放在独立的文件夹内**，每个文件夹是一个完整的组件单元，包含主文件、样式、类型定义。

**规范模板：**

```
src/
├── pages/
│   └── page-name/                # 页面目录
│       ├── index.tsx             # 页面入口
│       ├── types.ts              # 页面级类型定义
│       ├── consts.ts             # 页面级常量定义
│       ├── components/           # 页面私有组件
│       │   ├── ComponentName/
│       │   │   ├── index.tsx     # 主组件
│       │   │   └── types.ts      # 组件类型
│       │   └── SubComponent/
│       │       └── index.tsx
│       └── hooks/                # 页面私有 hooks
│           └── useXxx.ts
│
├── components/                   # 公共组件（多页面复用）
│   ├── Button/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── Modal/
│       ├── index.tsx
│       └── types.ts
│
├── stores/                       # 全局公共状态（Zustand），页面私有的放页面目录
│   └── useXxxStore.ts
│
├── hooks/                        # 全局公共 hooks，页面私有的放页面目录
│   └── useXxx.ts
│
├── services/                     # API 接口请求（按模块分文件夹）
│   └── XxxService/
│       ├── index.ts              # 接口请求方法
│       └── types.ts              # 接口类型定义
│
├── constants/                    # 公共常量（多模块复用，按业务领域拆分）
│   └── status.ts                 # 例：任务状态选项配置与颜色映射
│
├── types/                        # 仅全局通用类型
│   └── global.d.ts
│
└── mock/                         # Mock API
    └── xxx.js
```

**关键规定：**

1. **components 下每一层必须是文件夹**（名称为大驼峰），主组件文件必须命名为 `index.tsx`
2. **公共组件放 `src/components/`**，页面私有组件放 `src/pages/<page>/components/`
3. **`stores/` 和 `hooks/` 只放公共的**，页面私有的 Zustand Store 或 Hook 放对应页面目录下，stores 默认不使用在功能模块中
4. **`services/` 中每个 API 模块必须是独立文件夹**（如 `XxxService/index.ts` + `XxxService/types.ts`），不直接放 .ts 文件
5. **多个模块复用的公共常量必须放在 `src/constants/` 目录下**，页面私有常量放页面目录的 `consts.ts`；`src/constants/` 按业务领域拆分文件，命名使用小驼峰，例：`status.ts`、`frequency.ts`

### 文件命名规范

- 主组件文件：`index.tsx`
- 样式文件：`index.less`（仅在 Tailwind 无法覆盖时使用）
- 类型定义：`types.ts`
- 常量定义：`consts.ts`
- 工具函数：`utils.ts`
- 测试文件：`index.test.tsx`

---

## 📝 组件开发规范

### 组件模块化原则

如果封装的组件代码太少，或者没有必要，请不要单独封装组件，不要过度解耦

### 命名规范

所有 React 组件必须使用 **大驼峰命名法 (PascalCase)**，即每个单词首字母大写。

**正确示例：**

```typescript
// 文件命名
UserProfileCard.tsx
DataTable.tsx
LoadingSpinner.tsx

// 组件定义
const UserProfileCard: React.FC = () => { ... }
export default UserProfileCard;
```

**错误示例：**

```typescript
// ❌ 小驼峰命名
userProfileCard.tsx;

// ❌ 烤肉串命名
user - profile - card.tsx;

// ❌ 蛇形命名
user_profile_card.tsx;
```

### 组件导出规范

```typescript
// 默认导出组件
const UserCard: React.FC<UserCardProps> = (props) => {
  return <div>...</div>;
};
export default UserCard;

// 命名导出类型和工具函数
export interface UserCardProps { ... }
export const formatUserData = (data: UserCardProps) => { ... };
```

---

## 🔷 TypeScript 类型定义规范

### 核心原则

**所有 TypeScript 类型定义必须放在 `types.ts` 文件中**，包括 `interface`、`type`、`enum` 等类型声明

### 类型文件放置规则

1. **组件类型**：放在组件目录的 `types.ts` 中（如 `components/Button/types.ts`）
2. **页面类型**：放在页面目录的 `types.ts` 中（如 `pages/user-list/types.ts`）
3. **API 类型**：放在 services 模块的 `types.ts` 中（如 `services/UserService/types.ts`）
4. **全局类型**：放在 `src/types/` 目录下（如 `types/global.d.ts`），仅限全局通用类型

### 类型定义要求

1. **禁止在业务代码中直接定义类型**，所有类型声明必须提取到对应模块的 `types.ts` 文件中
2. **避免使用 `any` 类型**，优先使用 `unknown` 或明确的类型定义
3. **类型定义必须添加中文注释**说明用途
4. **使用 `Record<string, unknown>` 替代 `[key: string]: any`** 实现可扩展类型
5. **组件 Props 类型必须定义在同目录的 `types.ts` 中**
6. **API 请求参数和响应类型必须定义在 services 模块的 `types.ts` 中**

**正确示例：**

```typescript
// components/UserCard/types.ts

/**
 * 用户卡片组件 Props
 */
export interface UserCardProps {
  /** 用户信息 */
  user: UserInfo;
  /** 点击回调 */
  onClick?: (userId: string) => void;
}

/**
 * 用户信息类型
 */
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}
```

**错误示例：**

```typescript
// ❌ 错误：在组件文件中直接定义类型
const UserCard: React.FC<{ user: any; onClick?: Function }> = (props) => {
  // ...
};

// ❌ 错误：使用 any 类型
const processData = (data: any) => { ... };
```

---

## 🎨 样式规范

### 核心原则

**默认使用 Tailwind CSS 工具类**，直接在 JSX 中通过 className 使用

### 样式实现规则

1. **优先使用 Tailwind 工具类组合**完成样式，避免自定义 CSS
2. **禁止在 JSX 中使用内联 `style={{}}`**，样式必须通过 Tailwind 工具类或 `.less` 文件中的 className 实现
3. **Less 仅作为补充**，用于 Tailwind 无法覆盖的复杂自定义样式（如动画、特殊布局）
4. **Less 文件命名为 `index.less`** 并与组件文件同目录
5. 遵循 BEM 命名规范（仅在使用 `.less` 文件时）
6. 长 className 列表使用 `classnames` 库（已安装）动态组合，保持 JSX 可读性
7. **优先使用 Tailwind 内置类**，避免任意值写法（`[Npx]`）；仅当内置类无法精确表达时才使用任意值

**正确示例：**

```typescript
// ✅ 使用 Tailwind 工具类 + 内置尺寸类
<div className="flex items-center gap-2 p-4 bg-white rounded-xl">
  <img src={avatar} className="w-10 h-10 rounded-full" />
  <span className="text-base font-medium">{name}</span>
</div>
```

**错误示例：**

```typescript
// ❌ 错误：使用内联样式
<div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
  <img src={avatar} style={{ width: 40, height: 40, borderRadius: '50%' }} />
  <span style={{ fontSize: 16, fontWeight: 500 }}>{name}</span>
</div>

// ❌ 错误：有内置类可用却使用任意值
<div className="p-[12px] rounded-[12px] text-[14px] mb-[8px]">
// ✅ 应该这样写
<div className="p-3 rounded-xl text-sm mb-2">
```

---

## 🔌 API 调用规范

1. **接口请求统一在 `src/services` 中管理**，按模块分文件夹
2. 使用 axios 进行 HTTP 请求（通过 `@/utils/request` 封装）
3. 错误处理统一封装
4. **API 类型定义放在同目录的 `types.ts` 中**
5. **接口请求失败提示统一由 `@/utils/request` 的 `onError` 处理，业务调用方不得重复调用 Toast；仅非请求错误可按业务需要单独提示**

---

## 💻 代码风格规范

1. **使用 TypeScript 严格模式**
2. **遵循组件化开发原则**，保持代码可读性和可维护性
3. **所有类型定义必须集中管理在 `types.ts` 文件中**
4. **禁止在组件或业务逻辑代码中直接使用 `any` 类型**
5. 注释解释"为什么"，而非"做了什么"
6. 文本缩进 2 个空格
7. 提交前格式化代码

---

## ⚙️ 工程约定

- 路由模式：`history`；基础路径 `base: './'`
- 资源路径：`publicPath` 基于输出目录名动态设置
- 目录约定路由：`conventionRoutes.exclude` 排除 `components/`、`models/`、`hooks/`、`utils/`
