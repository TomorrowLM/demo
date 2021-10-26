/**
* 对于列表的混合
*/
export default {
    data() {
        return {
            // 列表项目
            items: [],
            // 当前页数
            page: 1,
            // 每页显示数量
            pageSize: 10,
            // 是否还有更多
            isHasMore: true,
            // 是否加载中
            isPending: false,
            isEmpty: false,
            // 是否自动加载
            isInit: true,
        }
    },
    // 定义一个混合对象
    created: function () {

        if (this.isInit)
            this.onInfinite()
    },
    methods: {
        /**
         * 加载数据
         *
         * @param {any} done
         * @param {any} isRefresh
         */
        onInfinite(done, isRefresh) {
            this.isPending = true
            // 获取数据
            return this.getData().then((items) => {
                if (items != undefined) {
                    // console.log("列表", items)
                    items.forEach(item => {
                        this.items.push(item)
                    })
                }
                // 判断是否还有更多数据
                this.page++;
                this.isHasMore = items.length>0
                this.isPending = false
                this.isEmpty = !this.isHasMore && this.items.length == 0
                // done && done()
            }, err => {
                this.isPending = false
            })
        },

    },
    computed: {
        // 没有更多了
        isNoMore() {
            return !this.isHasMore && !this.isPending && !this.isEmpty
        }
    }
}

