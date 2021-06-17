<template>
  <div class="page">
    <div class="header">
      <img src="../assets/Image.png" alt="" />
    </div>
    <div class="delivery">
      <div class="content">
        <div class="content-1">
          <div>Delivery</div>
          <div>
            <!-- <img src="../assets" alt=""> -->
          </div>
        </div>
        <div class="content-2">
          <div v-for="(value, index) in label" :key="index">{{ value }}</div>
        </div>
        <div class="content-3">
          <div class="level">
            <img
              src="../assets/shape-star.png"
              alt=""
              v-for="(v, index) in 5"
              :key="index"
            />
          </div>
          <div>4.8</div>
          <div>(194 Reviews)</div>
        </div>
        <div class="content-4">
          <div>
            <img src="../assets/Oval 4.png" alt="" />
            <img src="../assets/Oval 4.png" alt="" :style="styleImg[0]" />
            <img src="../assets/Oval 4.png" alt="" :style="styleImg[1]" />
          </div>
          <div>Mamie Martinez and Edith Lane Like this</div>
          <div>Show</div>
        </div>
      </div>
    </div>
    <div class="popular-text">Popular</div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="popular"
        v-for="item in list"
        :key="item"
        :title="item"
        @click="goToFoodDetail()"
      >
        <div class="popular-content">
          <div class="popular-content-1">
            <img src="../assets/Image.png" alt="" />
          </div>
          <div class="popular-content-2">
            <div class="popular-content-top">Turkey Gravy Secrets</div>
            <div class="popular-content-middle">
              You may be a person who loves to cook. You absolutel love to
            </div>
            <div class="popular-content-bottom">
              <div>
                <img src="../assets/shape-star.png" alt="" />
                <div>4.8</div>
                <div>(849)</div>
              </div>
              <div>
                <img src="../assets/round-dollar (1).png" alt="" />
                <div>$200</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
import { List } from "vant";
export default {
  data: () => {
    return {
      label: ["Noodle", "Korean", "Girl"],
      styleImg: ["left:-3%", "left:-6%"],
      list: [],
      loading: false,
      finished: false,
    };
  },
  components: { [Toast.name]: Toast, [List.name]: List },
  props: {},
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 9) {
          this.finished = true;
        }
      }, 1000);
    },
    goToFoodDetail() {
      this.$router.push("/FoodDetail");
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./../css/distribution-list.css"></style>
