// 引用组件
Vue.component('reference-component', {
    template: `
        <div class="reference-component" :class="{'active': isActive}">
            <div class="ref-header" @click="toggle">
                <span class="ref-id">{{ refId }}</span>
                <span class="ref-title">{{ title }}</span>
                <span class="toggle-icon">{{ isActive ? '−' : '+' }}</span>
            </div>
            <div v-if="isActive" class="ref-content">
                <div v-html="compiledContent"></div>
            </div>
        </div>
    `,
    props: {
        refId: String,
        title: String,
        content: String
    },
    data() {
        return {
            isActive: false,
            md: null
        }
    },
    computed: {
        compiledContent() {
            if (!this.md) return this.content
            return this.content ? this.md.render(this.content) : ''
        }
    },
    mounted() {
        // 初始化 markdown 解析器
        this.md = window.markdownit({
            html: true,
            linkify: true
        })
    },
    methods: {
        toggle() {
            this.isActive = !this.isActive
            this.$emit('click', this.refId)
        }
    }
})