<template>
  <div class="computer">
    <!-- 电脑问卷 -->
    <div v-if="!isEmpty">
      <ul class="list">
        <li v-for="item in lists" :key="item.id">
          <list :list="item"></list>
        </li>
      </ul>
      <!-- <div class="nomore" v-if="isNoMore">没有更多数据</div> -->
      <!-- <div class="loadmore" v-else @click="loadMore">加载更多</div> -->
    </div>
    <empty v-else></empty>
    <loading v-if="isPending"></loading>

  </div>
</template>
<script>
import List from "./common/List";
import Empty from "./common/Empty";
// import list from "@/mixin/list";
import common from "../api/common";

export default {
  name: "computer",
  components: {
    List,
    Empty
  },
  // mixins: [list],
  data() {
    return {
      // isInit:false,//是否自动加载
      isEmpty: false,
      isPending:true,//是否加载中
      lists:[],
    };
  },
  created() {
    common.partition_survey("0","2","1","").then(data=>{
      this.isPending = false
      this.lists = data.data.surveyList
      if(this.lists.length == 0){
        this.isEmpty = true
      }else{
        this.isEmpty = false
      }
      console.log(data,"电脑问卷")
    })
  },
  methods: {
    // loadMore() {
    //   this.onInfinite()
    //   // console.log(this.items)
      
    // },
    // getData() {
    //   return new Promise((resolve, reject) => {
    //     return resolve([]);
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}
.computer{
  position:relative;
}
.list {
  margin-top: 10px;
  li {
    padding: 30px 10px;
    border-bottom: 1px dashed #ddd;
    overflow: hidden;
    position: relative;
  }
}
</style>
