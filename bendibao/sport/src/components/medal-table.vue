<template>
  <div>
    <div class="total">
      <div class="total-icon" v-for="(v, i) in iconText" :key="i">
        <img v-bind:src="icon[i]" />
        <span>{{ v }}</span>
      </div>
    </div>

    <div class="list">
      <div v-for="(v, i) in modalList" :key="i">
        <div>{{ v[0] }}</div>
        <div>{{ v[1] }}</div>
        <div>{{ v[2] }}</div>
        <div>{{ v[3] }}</div>
        <div>{{ v[4] }}</div>
      </div>
    </div>
    <div class="showMore">
      <div @click="loadMore" class="more" v-if="loading">查看更多</div>
      <div class="more" v-if="finished">没有更多了</div>
    </div>
    <div class="swiper">
      <van-swipe :autoplay="3000" width="100%" height="20px">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import "./../css/modal-table.css";
import { List, Swipe, SwipeItem } from "vant";

import { Lazyload } from "vant";

export default {
  data: function () {
    return {
      iconText: ["省份", "金牌", "银牌", "铜牌", "总计"],
      url: "../static/铜牌.png",
      icon: [
        require("../static/省份.png"),
        require("../static/金牌.png"),
        require("../static/银牌.png"),
        require("../static/铜牌.png"),
      ],
      loading: true,
      finished: false,
      modalList: [["广东省", 36, 2275, 2275, 7]],
      images: [require("../static/1.png"), require("../static/1.png")],
    };
  },
  components: {
    [List.name]: List,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Lazyload.name]: Lazyload,
  },
  beforeMount() {
    let initialList = this.modalList[0];
    for (let i = 0; i < 5; i++) {
      console.log(initialList);
      this.modalList.push(initialList);
    }
    console.log(this.modalList);
  },
  methods: {
    loadMore: function () {
      let initialList = ["广东省", 36, 2275, 2275, 7];
      for (let i = 0; i < 5; i++) {
        console.log(initialList);
        this.modalList.push(initialList);
      }
      this.loading = false;
      this.finished = true;
    },
  },
};
</script>
