<template>
  <div class="detailList">
    <ol class="title">
      <li v-for="(item ,index) in titleData" :key="index">{{item}}</li>
    </ol>
    <div v-if="!isEmpty" class="listBox">
      <ul v-for="(item,index) in items" :item="item" :key="index">
        <li>{{item.title}}</li>
        <li>{{item.date}}</li>
        <li :class="[String(item.gold).indexOf('-')!=-1?'down':'up']">{{item.gold}}</li>
      </ul>
      <!-- <detail-list v-for="(item,index) in items" :item="item" :key="index" pageName="in"></detail-list> -->
      <div class="nomore" v-if="isNoMore">没有更多数据</div>
      <div class="loadmore" v-else @click="loadMore">加载更多</div>
    </div>
    <div class="empty" v-else>暂无数据</div>
    <loading v-if="isPending"></loading>
  </div>
</template> 
<script>
// import DetailList from "./common/DetailList";
import list from "@/mixin/list";
import common from "../api/common";

export default {
  name: "detaillist",
  // components: {
  //   DetailList
  // },
  mixins: [list],
  data() {
    return {
      titleData: ["收入来源", "日期", "金币变化"]
      // isInit: false,
      // isNoMore:false
    };
  },
  mounted() {},
  methods: {
    loadMore() {
      this.onInfinite();
    },
    getData() {
      return common
        .getUserGoldIncomeRecord(String(this.page), String(this.pageSize))
        .then(data => {
          // console.log(data.data.currPage,this.page)
          if (data.data.currPage < this.page) {
            //没有更多数据
            return [];
          } else {
            return data.data.list;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
.empty {
  text-align: center;
  line-height: 50px;
  font-size: 14px;
  color: #999;
}
.detailList {
  margin-top: 40px;
  position: relative;
  .listBox {
    overflow: hidden;
  }
  li {
    vertical-align: middle;
    display: inline-block;
    font-size: 16px;
    word-wrap: break-word;
    &:nth-child(1) {
      width: 30%;
      margin-left: 4%;
      line-height: 24px;
      overflow: hidden;
    }
    &:nth-child(2) {
      width: 41%;
      margin-left: 3%;
      height: 50px;
      line-height: 50px;
    }
    &:nth-child(3) {
      width: 20%;
      height: 50px;
      line-height: 50px;
      &.up {
        color: #7575f9;
      }
      &.down {
        color: #576b95;
      }
    }
  }
  ol {
    @include size(100%, 60px);
    background: #f6f6f6;
    border-radius: 4px;
    color: #333;
    font-weight: bold;
  }
  ul {
    width: 100%;
    min-height: 50px;
    padding: 5px 0;
    overflow: hidden;
    border-bottom: 1px dashed #ddd;
    color: #666;
  }
  .surverListLoder {
    position: fixed;
    top: 350px;
    left: 55%;
  }
}
</style>

