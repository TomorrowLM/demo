<template>
  <div class="computedList">
    <!-- 历史问卷 -->
    <div v-if="!isEmpty">
      <ul class="completed">
        <li v-for="list in items" :key="list.id">
          <div class="dis">
            <div class="name">{{list.surveyName}}</div>
            <div class="people">{{list.time}}</div>
          </div>
          <div class="price">{{list.gold}}</div>
        </li>
      </ul>
      <div class="nomore" v-if="isNoMore">没有更多数据</div>
      <div class="loadmore" v-else @click="loadMore">加载更多</div>
    </div>
    <empty msg="您还未完成问卷" msg2="赶紧去参与领奖励吧" v-else></empty>
    <loading v-if="isPending"></loading>
  </div>
</template>
<script>
import List from "./common/List";
import Empty from "./common/Empty";
import list from "@/mixin/list";
import common from "../api/common";

export default {
  name: "completed",
  components: {
    List,
    Empty
  },
  mixins: [list],
  data() {
    return {
      isEmpty: false //空状态的控制
      // isInit:false//是否自动加载
    };
  },
  created() {
    // this.onInfinite()
  },
  methods: {
    loadMore() {
      this.onInfinite();
      console.log(this.items);
    },
    getData() {
      return common
        .partition_survey("0", "3", String(this.page), String(this.pageSize))
        .then(data => {
          return data.data.surveyList;
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
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}
.computedList {
  position: relative;
}
.completed {
  margin-top: 10px;
  li {
    background: url(../../static/images/task_list_ic_comp.png) no-repeat 60% 0;
    padding: 30px 10px;
    border-bottom: 1px dashed #ddd;
    overflow: hidden;
    position: relative;
    .dis {
      float: left;
      position: absolute;
      top: 16px;
      left: 10px;
      right: 160px;
      .name {
        font-size: 16px;
        color: #666;
        margin: 0px 0 15px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .people {
        font-size: 12px;
        color: #bbb;
      }
    }
    .price {
      float: right;
      font-size: 20px;
      color: #7575f9;
      padding-right: 10px;
    }
  }
}
</style>
