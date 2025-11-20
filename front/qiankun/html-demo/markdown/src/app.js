// 主应用 Vue 实例
new Vue({
    el: '#app',
    data: {
        md: null,
        markdownText: `# Markdown 引用组件演示

## 介绍

这是一个演示如何在 Markdown 中将特定格式转换为 Vue 组件的示例。

## 使用引用

在文档中，我们可以使用以下语法创建引用：

:::ref{id="vue" title="Vue.js 官方文档"}
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。

**特点：**
- 易用
- 灵活
- 高效
:::

这里提到了前端框架：[[ref:vue]]，这是一个非常流行的选择。

## 另一个引用

:::ref{id="markdown" title="Markdown 语法"}
Markdown 是一种轻量级标记语言，允许人们使用易读易写的纯文本格式编写文档。

[了解更多](https://markdown.com.cn)
:::

写作时使用 [[ref:markdown]] 可以让内容更加结构化。

## 代码示例

\`\`\`javascript
// 这是一个 JavaScript 示例
function hello() {
    console.log("Hello, Markdown!");
    return "欢迎使用引用系统";
}
\`\`\`

## 更多引用

:::ref{id="react" title="React 框架"}
React 是一个用于构建用户界面的 JavaScript 库。
:::

比较 [[ref:vue]] 和 [[ref:react]] 的不同特点。

文档结束。
`,
        references: []
    },
    computed: {
        compiledMarkdown() {
            if (!this.md) return ''
            this.references = []
            return this.md.render(this.markdownText)
        }
    },
    mounted() {
        this.initMarkdown()
    },
    methods: {
        initMarkdown() {
            // 初始化 markdown-it
            this.md = window.markdownit({
                html: true,
                linkify: true,
                typographer: true,
                highlight: function (str, lang) {
                    return '<pre class="code-block"><code class="language-' + lang + '">' + 
                           this.md.utils.escapeHtml(str) + '</code></pre>';
                }.bind(this)
            })
            
            // 添加自定义容器插件
            this.setupRefContainer()
            
            // 添加内联引用处理
            this.setupInlineRefs()
        },
        
        setupRefContainer() {
            const self = this
            
            // 自定义容器插件
            this.md.use(function(md) {
                const defaultRender = md.renderer.rules.fence
                
                // 处理 :::ref 容器
                md.block.ruler.before('fence', 'ref_container', function(state, startLine, endLine, silent) {
                    const pos = state.bMarks[startLine] + state.tShift[startLine]
                    const max = state.eMarks[startLine]
                    
                    // 检查是否以 ::: 开头
                    if (state.src.charCodeAt(pos) !== 0x3A/* : */) return false
                    if (state.src.charCodeAt(pos + 1) !== 0x3A) return false
                    if (state.src.charCodeAt(pos + 2) !== 0x3A) return false
                    
                    const marker = state.src.slice(pos, pos + 3)
                    const params = state.src.slice(pos + 3, max).trim()
                    
                    // 验证是否是 ref 容器
                    if (!params.match(/^ref/)) return false
                    
                    if (silent) return true
                    
                    // 查找结束标记
                    let nextLine = startLine
                    let haveEndMarker = false
                    
                    while (nextLine < endLine) {
                        nextLine++
                        const pos = state.bMarks[nextLine] + state.tShift[nextLine]
                        const max = state.eMarks[nextLine]
                        
                        if (state.src.charCodeAt(pos) === 0x3A && 
                            state.src.charCodeAt(pos + 1) === 0x3A &&
                            state.src.charCodeAt(pos + 2) === 0x3A) {
                            haveEndMarker = true
                            break
                        }
                    }
                    
                    if (!haveEndMarker) return false
                    
                    // 解析属性
                    const attrRegex = /(\w+)="([^"]*)"/g
                    const attrs = {}
                    let match
                    while ((match = attrRegex.exec(params)) !== null) {
                        attrs[match[1]] = match[2]
                    }
                    
                    // 提取内容
                    const contentStart = startLine + 1
                    const contentEnd = nextLine
                    const content = state.getLines(contentStart, contentEnd, state.blkIndent, false)
                    
                    // 存储引用信息
                    self.references.push({
                        id: attrs.id || 'unknown',
                        title: attrs.title || `引用 ${attrs.id}`,
                        content: content,
                        type: 'block'
                    })
                    
                    // 创建 token
                    const token_o = state.push('ref_container_open', 'div', 1)
                    token_o.attrSet('class', 'ref-container')
                    token_o.attrSet('data-ref', attrs.id)
                    token_o.markup = marker
                    token_o.info = params
                    
                    const token_c = state.push('ref_container_close', 'div', -1)
                    token_c.markup = marker
                    
                    state.line = nextLine + 1
                    return true
                })
                
                // 渲染 ref 容器
                md.renderer.rules.ref_container_open = function(tokens, idx) {
                    const token = tokens[idx]
                    const refId = token.attrGet('data-ref')
                    return `<span class="ref-marker" data-ref="${refId}">[${refId}]</span>`
                }
                
                md.renderer.rules.ref_container_close = function() {
                    return ''
                }
            })
        },
        
        setupInlineRefs() {
            const defaultTextRule = this.md.renderer.rules.text
            const self = this
            
            this.md.renderer.rules.text = function(tokens, idx, options, env, renderer) {
                let content = tokens[idx].content
                
                // 处理内联引用 [[ref:id]]
                const inlineRefRegex = /\[\[ref:(\w+)\]\]/g
                if (inlineRefRegex.test(content)) {
                    let result = ''
                    let lastIndex = 0
                    let match
                    
                    const regex = new RegExp(inlineRefRegex.source, 'g')
                    
                    while ((match = regex.exec(content)) !== null) {
                        result += content.slice(lastIndex, match.index)
                        
                        const refId = match[1]
                        const ref = self.references.find(r => r.id === refId)
                        const title = ref ? ref.title : `引用 ${refId}`
                        
                        result += `<span class="ref-inline" data-ref="${refId}">[${title}]</span>`
                        lastIndex = regex.lastIndex
                    }
                    
                    result += content.slice(lastIndex)
                    return result
                }
                
                return defaultTextRule 
                    ? defaultTextRule(tokens, idx, options, env, renderer)
                    : content
            }
        },
        
        parseAttributes(params) {
            const attrs = {}
            const regex = /(\w+)="([^"]*)"/g
            let match
            
            while ((match = regex.exec(params)) !== null) {
                attrs[match[1]] = match[2]
            }
            
            return attrs
        },
        
        highlightRef(refId) {
            // 高亮显示对应的引用标记
            const markers = document.querySelectorAll(`[data-ref="${refId}"]`)
            markers.forEach(marker => {
                marker.classList.add('highlight')
                setTimeout(() => {
                    marker.classList.remove('highlight')
                }, 2000)
            })
        }
    }
})