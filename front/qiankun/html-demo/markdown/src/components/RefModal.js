// 引用弹框组件
Vue.component('ref-modal', {
    template: `
        <div class="modal-overlay" @click.self="close">
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">{{ refData.title }}</h2>
                    <button class="close-button" @click="close">×</button>
                </div>
                
                <div class="modal-content">
                    <div class="ref-meta">
                        <span class="ref-type" :class="refData.type">{{ getTypeText(refData.type) }}</span>
                        <div class="ref-tags">
                            <span 
                                v-for="tag in refData.tags" 
                                :key="tag"
                                class="tag"
                            >
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="ref-content" v-html="compiledContent"></div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="close">关闭</button>
                    <button class="btn btn-primary" @click="copyContent">复制内容</button>
                </div>
            </div>
        </div>
    `,
    props: {
        refData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            md: null
        }
    },
    computed: {
        compiledContent() {
            if (!this.md) return this.refData.content
            return this.refData.content ? this.md.render(this.refData.content) : ''
        }
    },
    mounted() {
        // 初始化 markdown 解析器
        this.md = window.markdownit({
            html: true,
            linkify: true,
            typographer: true
        })
        
        // 阻止背景滚动
        document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
        // 恢复背景滚动
        document.body.style.overflow = ''
    },
    methods: {
        close() {
            this.$emit('close')
        },
        
        getTypeText(type) {
            const typeMap = {
                'technology': '技术',
                'concept': '概念',
                'tool': '工具'
            }
            return typeMap[type] || type
        },
        
        copyContent() {
            const plainText = this.refData.content.replace(/#+\s?/g, '').replace(/`/g, '')
            navigator.clipboard.writeText(plainText).then(() => {
                alert('内容已复制到剪贴板！')
            }).catch(err => {
                console.error('复制失败:', err)
                alert('复制失败，请手动复制内容')
            })
        }
    }
})