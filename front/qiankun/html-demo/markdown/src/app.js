// 主应用 Vue 实例
const vueApp = new Vue({
    el: '#app',
    data: {
        md: null,
        markdownText: `# Markdown 引用弹框演示

## 介绍

这个演示展示了如何在 Markdown 中点击引用标记弹出详细信息框。

## 引用示例

### 技术文档引用
这里提到了 ref_vue 框架，这是一个非常流行的前端框架。

### 概念解释
在编程中，ref_closure 是一个重要的概念。

### 工具推荐
开发时可以使用 ref_vscode 编辑器提高效率。

## 更多引用示例

学习 ref_promise 对于理解异步编程很重要。

ref_react 是另一个流行的前端框架。

ref_ajax 用于异步数据请求。

## 代码示例

\`\`\`javascript
// 使用 ref_ajax 进行数据请求
function fetchData() {
    return new Promise((resolve, reject) => {
        // 异步操作
    });
}
\`\`\`

文档结束。
`,
        references: [
            {
                id: 'vue',
                title: 'Vue.js 框架',
                type: 'technology',
                content: `# Vue.js

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。

## 核心特性

- **易用性**：熟悉 HTML、CSS、JavaScript 后即可快速上手
- **灵活性**：渐进式框架，可以根据需求逐步采用
- **高性能**：虚拟 DOM 和智能优化确保运行效率
- **组件化**：单文件组件，更好的代码组织和复用

## 版本信息

- 最新版本：3.x
- 创建者：尤雨溪
- 首次发布：2014年2月

## 使用场景

- 单页面应用 (SPA)
- 复杂的交互界面
- 需要响应式的数据绑定`,
                tags: ['前端', '框架', 'JavaScript']
            },
            {
                id: 'closure',
                title: '闭包 (Closure)',
                type: 'concept',
                content: `# 闭包

闭包是指那些能够访问自由变量的函数。

## 定义

闭包是一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起组合成的实体。

## 特点

1. **函数嵌套**：一个函数内部定义另一个函数
2. **内部函数引用外部变量**：内部函数可以访问外部函数的变量
3. **外部函数执行完毕后**：内部函数仍可访问外部函数的变量

## JavaScript 示例

\`\`\`javascript
function outer() {
    let count = 0;
    
    return function inner() {
        count++;
        return count;
    };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

## 应用场景

- 数据封装和私有变量
- 函数工厂
- 回调函数
- 模块模式`,
                tags: ['编程', 'JavaScript', '概念']
            },
            {
                id: 'vscode',
                title: 'Visual Studio Code',
                type: 'tool',
                content: `# Visual Studio Code

Visual Studio Code 是一个轻量级但功能强大的源代码编辑器。

## 主要特性

- **智能代码补全**：基于变量类型，函数定义，和导入的模块
- **调试功能**：内置调试功能，支持 Node.js 调试
- **Git 集成**：内置 Git 命令
- **扩展生态系统**：丰富的扩展市场
- **终端集成**：内置终端面板

## 常用快捷键

| 功能 | Windows/Linux | macOS |
|------|---------------|-------|
| 打开命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 快速打开文件 | Ctrl+P | Cmd+P |
| 格式化文档 | Shift+Alt+F | Shift+Option+F |
| 行注释 | Ctrl+/ | Cmd+/ |

## 推荐扩展

- ESLint
- Prettier
- GitLens
- Live Server
- Bracket Pair Colorizer`,
                tags: ['编辑器', '开发工具', '微软']
            },
            {
                id: 'promise',
                title: 'Promise 对象',
                type: 'concept',
                content: `# Promise

Promise 对象用于表示一个异步操作的最终完成（或失败）及其结果值。

## 状态

Promise 有三种状态：
- **pending**：初始状态，既不是成功，也不是失败状态
- **fulfilled**：意味着操作成功完成
- **rejected**：意味着操作失败

## 基本用法

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve('操作成功！');
        } else {
            reject('操作失败！');
        }
    }, 1000);
});

promise
    .then(result => {
        console.log(result); // "操作成功！"
    })
    .catch(error => {
        console.error(error); // "操作失败！"
    });
\`\`\`

## 链式调用

\`\`\`javascript
fetch('/api/data')
    .then(response => response.json())
    .then(data => processData(data))
    .then(result => displayResult(result))
    .catch(error => handleError(error));
\`\`\`

## 静态方法

- \`Promise.all()\`：等待所有 promise 完成
- \`Promise.race()\`：等待第一个 promise 完成
- \`Promise.resolve()\`：返回一个 resolved 的 promise
- \`Promise.reject()\`：返回一个 rejected 的 promise`,
                tags: ['JavaScript', '异步', 'ES6']
            },
            {
                id: 'react',
                title: 'React 框架',
                type: 'technology',
                content: `# React

React 是一个用于构建用户界面的 JavaScript 库。

## 核心概念

### 组件
React 应用由组件构成，组件可以是函数组件或类组件。

### JSX
JSX 是 JavaScript 的语法扩展，允许在 JavaScript 中写类似 HTML 的代码。

### 状态管理
使用 useState Hook 或 this.state 管理组件状态。

### 生命周期
组件有不同的生命周期方法，如 componentDidMount、useEffect 等。

## 示例代码

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                点击增加
            </button>
        </div>
    );
}
\`\`\`

## 生态系统

- React Router：路由管理
- Redux：状态管理
- Material-UI：UI 组件库
- Next.js：服务端渲染框架`,
                tags: ['前端', '框架', 'JavaScript']
            },
            {
                id: 'ajax',
                title: 'AJAX 技术',
                type: 'technology',
                content: `# AJAX

AJAX (Asynchronous JavaScript and XML) 是一种创建快速动态网页的技术。

## 工作原理

通过在后台与服务器进行少量数据交换，AJAX 可以使网页实现异步更新。

## 原生 JavaScript 实现

\`\`\`javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    }
};
xhr.send();
\`\`\`

## Fetch API

\`\`\`javascript
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
\`\`\`

## 常用场景

- 表单验证
- 自动完成
- 无限滚动
- 实时数据更新

## 优势

- 提升用户体验
- 减少服务器负载
- 异步更新，不阻塞用户界面`,
                tags: ['Web开发', 'JavaScript', '异步']
            }
        ],
        showModal: false,
        currentRef: null
    },
    computed: {
        compiledMarkdown() {
            if (!this.md) return ''
            // 每次渲染前清空引用列表
            this.references.forEach(ref => {
                ref.rendered = false
            })
            const result = this.md.render(this.markdownText)
            return result
        }
    },
    mounted() {
        this.initMarkdown()
        // 将handleRefClick方法暴露为全局函数
        window.handleRefClick = (event) => {
            console.log('Global handleRefClick called');
            this.handleRefClick(event);
        };
    },
    methods: {
        initMarkdown() {
            this.md = window.markdownit({
                html: true,
                linkify: true,
                typographer: true,
                highlight: function (str, lang) {
                    return '<pre class="code-block"><code class="language-' + lang + '">' +
                        this.md.utils.escapeHtml(str) + '</code></pre>';
                }.bind(this)
            })

            // 设置引用标记处理 - 修复版本
            this.setupRefMarkers()
        },

        setupRefMarkers() {
            const self = this

            // 保存原始的文字渲染规则
            const defaultTextRule = this.md.renderer.rules.text

            // 重写文字渲染规则
            this.md.renderer.rules.text = function (tokens, idx, options, env, renderer) {
                let content = tokens[idx].content

                // 处理 ref_xxx 格式的引用
                const refRegex = /ref_(\w+)/g
                let match
                let lastIndex = 0
                let result = ''

                while ((match = refRegex.exec(content)) !== null) {
                    // 添加匹配前的普通文本
                    result += content.slice(lastIndex, match.index)

                    const refId = match[1]
                    const ref = self.references.find(r => r.id === refId)

                    if (ref) {
                        // 找到对应的引用，创建可点击元素
                        const title = ref.title
                        result += `<span class="ref-marker" data-ref="${refId}" title="点击查看 ${title} 的详细信息" onclick="handleRefClick(event)">${title}</span>`
                    } else {
                        // 没有找到引用，保持原样显示
                        result += match[0]
                    }

                    lastIndex = refRegex.lastIndex
                }

                // 添加剩余文本
                result += content.slice(lastIndex)

                // 如果没有任何匹配，使用默认渲染
                if (result === '' && lastIndex === 0) {
                    return defaultTextRule
                        ? defaultTextRule(tokens, idx, options, env, renderer)
                        : content
                }

                return result
            }
        },

        handleRefClick(event) {
            console.log('ref clicked')
            // 检查点击的是否是引用标记
            const refElement = event.target.closest('.ref-marker')
            if (refElement) {
                const refId = refElement.getAttribute('data-ref')
                this.showRefModal(refId)
                event.preventDefault()
                event.stopPropagation()
            }
        },

        showRefModal(refId) {
            console.log('点击引用:', refId) // 调试信息
            const ref = this.references.find(r => r.id === refId)
            if (ref) {
                this.currentRef = ref
                this.showModal = true
                console.log('显示弹框:', ref.title) // 调试信息
            } else {
                console.warn('未找到引用:', refId) // 调试信息
            }
        },

        closeModal() {
            this.showModal = false
            this.currentRef = null
        }
    }
})