const vm = new Vue({
    el: '#app',
    data() {
        return {
            headerSelectV: '深圳',

            searchQuery: '',

            activeNameF: 'basicInfoSearch',
            activeNameS: 'windowSearch'
        }
    },
    mounted() {
        this.$refs['panelF'].style.height = 31.375 + 'rem'
        this.$refs['panelS'].style.height = 18.75 + 'rem'
    },
    methods: {
        handleClickF(tab) {
            setInterval(() => {
                if (tab.$el.clientHeight !== 0) {
                    this.$refs['panelF'].style.height = tab.$el.clientHeight / 16 + 7 + 'rem'
                } else {
                    return
                }
            }, 10);
        },
        handleClickS() {}
    }
})