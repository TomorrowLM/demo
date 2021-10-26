
// 列表的上拉加载 下拉刷新
const mixin = {
  data() {
    return {
      list: null,//列表数据 
      loading: false,//是否加载
      finished: false,//是否结束
      refreshing: false,//是否下拉刷新
      isPull:false,//是否有上拉加载/分页功能
      page:1,//页码
      limit:10,//一页的条数
      isEmpty:-1//0:页面有数据 1：页面展示空状态
    }
  },

  created() {
    
  },
  methods: {
    onLoad() {
      if (this.refreshing) {//下拉刷新时
        this.list = [];
        this.page = 1
        this.refreshing = false;
      }
      this.getList().then(res=>{
        if(this.list==null){
          this.list = []
        }
        if(this.page == 1&&res.data.surveyList.length == 0){//第一页请求的数据为空
          this.isEmpty = 1
        }else{
          this.isEmpty = 0
          this.list = this.list.concat(res.data.surveyList)//0AE20A9D91A355A1C3848EC90D732C6227A0AE233DFA810196B430E9998B3C5E
        }
        if(this.isPull){//有分页的（历史问卷）
          if(res.data.surveyList.length==0){
            this.finished = true;//没有更多
          }else{
            this.loading = false;
            this.page++
          }
        }else{//没有分页功能（一区问卷）
          this.finished = true;//没有更多
        }
      })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  }
}

export { mixin }