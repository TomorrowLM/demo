<template>
  <div class="detailList">
    <ol class="title">
      <li v-for="(item ,index) in titleData" :key="index">{{item}}</li>
    </ol>
    <div v-if="!isEmpty">
      <detail-list v-for="(item,index) in items" :item="item" :key="index"></detail-list>
      <div class="nomore" v-if="isNoMore">没有更多数据</div>
      <div class="loadmore" v-else @click="loadMore">加载更多</div>
    </div>
    <div class="empty" v-else>
      <img src="../../static/images/my_integral_img_norecord.png" alt srcset />
      <p>暂无记录</p>
      <p>答完问卷，记得拼任务App领取金币哦！</p>
    </div>
    <loading v-if="isPending"></loading>
  </div>
</template>
<script>
import DetailList from "./common/DetailList";
import list from "@/mixin/list";
import common from "../api/common";

export default {
  name: "detaillist",
  components: {
    DetailList
  },
  mixins: [list],
  data() {
    return {
      titleData: ["金币来源/去向", "日期", "金币变化"]
    };
  },
  mounted() {},
  methods: {
    loadMore() {
      this.onInfinite();
    },
    getData() {
      return common
        .getUserIntegral(String(this.page), String(this.pageSize))
        .then(data => {
          // console.log(data.data.currPage, this.page);
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
  padding: 10px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  color: #999;
  img {
    width: 150px;
  }
}
.detailList {
  margin-top: 40px;
  position: relative;
  li {
    float: left;
    height: 60px;
    line-height: 60px;
    font-size: 16px;

    &:nth-child(1) {
      width: 30%;
      margin-left: 4%;
    }
    &:nth-child(2) {
      width: 42%;
      margin-left: 3%;
    }
    &:nth-child(3) {
      width: 20%;
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
    @include size(100%, 60px);
    border-bottom: 1px dashed #ddd;
    color: #666;
  }
}
</style>

