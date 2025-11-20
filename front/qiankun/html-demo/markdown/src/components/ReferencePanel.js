// 引用面板组件
Vue.component('reference-panel', {
    template: `
        <div class="reference-panel">
            <h3>📚 引用列表</h3>
            <div class="ref-count">共 {{ references.length }} 个引用</div>
            
            <div class="ref-list">
                <div 
                    v-for="ref in references" 
                    :key="ref.id"
                    class="ref-item"
                    @click="handleClick(ref.id)"
                >
                    <span class="ref-badge">{{ ref.id }}</span>
                    <span class="ref-title">{{ ref.title }}</span>
                </div>
            </div>
            
            <div v-if="references.length === 0" class="empty-state">
                📝 暂无引用，在编辑器中添加 :::ref 语法来创建引用
            </div>
        </div>
    `,
    props: {
        references: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleClick(refId) {
            this.$emit('ref-click', refId)
        }
    }
})