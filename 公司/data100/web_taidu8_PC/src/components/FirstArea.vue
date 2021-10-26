<template>
  <div class="firstArea">
    <!-- 寻智囊 -->
    <ul class="list" v-if="!isEmpty">
      <li v-for="item in lists" :key="item.surveyId">
        <list :list="item"></list>
      </li>
    </ul>
    <empty v-else></empty>
    <loading v-if="isPending"></loading>
  </div>
</template>
<script>
import List from "./common/List";
import Empty from "./common/Empty";
import common from "../api/common";
export default {
  name: "fisrtarea",
  components: {
    List,
    Empty
  },
  data() {
    return {
      lists: [], //寻智囊列表数据
      isEmpty: false,
      isPending: true, //是否加载中
      isFlag: 0,
    };
  },
  created() {
    common.partition_survey("0", "0", "1", "").then(data => {
      if (data.code == 1) {
        this.isPending = false;
        this.lists = data.data.surveyList;
        if (this.lists.length == 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      }
    });
  },
  methods: {}
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
.firstArea {
  position: relative;
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

.loadmore {
  width: 160px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #7575f9;
  border: 1px solid #7575f9;
  border-radius: 6px;
  margin: 20px auto;
  cursor: pointer;
}
.nomore {
  width: 160px;
  height: 40px;
  line-height: 40px;
  color: #7575f9;
  margin: 10px auto;
  text-align: center;
}
</style>
