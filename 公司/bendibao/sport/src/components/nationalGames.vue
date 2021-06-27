<template>
  <div class="page">
    <div class="module-1 module">
      <div class="icon">
        <div class="icon-1"></div>
        <div class="icon-2"></div>
        <div>志愿者专区</div>
      </div>
      <div class="tab">
        <van-tabs v-model="active1">
          <van-tab title="办事指南">
            <div class="row-1 row">
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
            </div>
            <div class="row-2 row">
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
            </div>
          </van-tab>
          <van-tab title="我要预约">内容 2</van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="module-1 module">
      <div class="icon">
        <div class="icon-1"></div>
        <div class="icon-2"></div>
        <div>志愿者专区</div>
      </div>
      <div class="tab">
        <van-tabs v-model="active2">
          <van-tab title="办事指南">
            <div class="row-1 row">
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
            </div>
            <div class="row-2 row">
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
            </div>
          </van-tab>
          <van-tab title="我要预约">内容 2</van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="module-1 module">
      <div class="icon">
        <div class="icon-1"></div>
        <div class="icon-2"></div>
        <div>志愿者专区</div>
      </div>
      <div class="tab">
        <van-tabs v-model="active3">
          <van-tab title="办事指南">
            <div class="row-1 row">
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
            </div>
            <div class="row-2 row">
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
              <van-field
                is-link
                readonly
                label=""
                placeholder="请选择所在地区"
                @click="show = true"
              />
            </div>
          </van-tab>
          <van-tab title="我要预约">内容 2</van-tab>
        </van-tabs>
      </div>
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
import { Tab, Tabs, Cascader, Swipe, SwipeItem } from "vant";
export default {
  data: function () {
    return {
      active1: 0,
      active2: 0,
      active3: 0,
      images: [require("../static/1.png"), require("../static/1.png")],
    };
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Cascader.name]: Cascader,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  methods: {},
};
</script>
<style scoped src="../css/nationalGames.css"></style>
