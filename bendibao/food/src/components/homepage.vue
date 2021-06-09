<template>
  <div class="page">
    <div class="nav">
      <div class="nav-layout">
        <mu-flex justify-content="center" align-items="center">
          <img src="../assets/导航.png" alt="" @click="open = !open" />
        </mu-flex>
        <mu-drawer
          :open.sync="open"
          :docked="docked"
          :right="position === 'right'"
        >
          <mu-list>
            <mu-list-item button @click="goToMine">
              <mu-list-item-title>
                <mu-list-item-title>我的</mu-list-item-title>
              </mu-list-item-title>
            </mu-list-item>
            <mu-list-item button @click="goToDistribution">
              <mu-list-item-title>配送</mu-list-item-title>
            </mu-list-item>
            <mu-list-item @click="open = false" button>
              <mu-list-item-title>Close</mu-list-item-title>
            </mu-list-item>
          </mu-list>
        </mu-drawer>
      </div>
      <div></div>
    </div>
    <div class="headerText">
      {{ headerText }}
    </div>
    <div class="nav-icon">
      <div>
        <div>Chicken</div>
      </div>
      <div>
        <div>Steak</div>
      </div>
      <div>
        <div>Kake</div>
      </div>
      <div>
        <div>Grilled</div>
      </div>
    </div>
    <div class="section">
      <div>
        <div class="section-1">
          <div>
            <div>House of Blues San Diego</div>
            <div>1640 Camino Del Rio N</div>
          </div>
          <div><div></div></div>
        </div>
        <hr />
        <div class="section-2">
          <div>
            <img src="../assets/shape-star.png" alt="" />
            <span>4.8</span>
            <span>(849)</span>
          </div>
          <div>
            <img src="../assets/时 间.png" alt="" />
            <span>10-15 mins</span>
          </div>
          <div>
            <img src="../assets/round-dollar (1).png" alt="" />
            <span>$200</span>
          </div>
        </div>
      </div>
    </div>
    <div class="text-1">Collections for you</div>
    <div class="swiper">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="../assets/Bitmap_1.png" alt="" />
          </div>
          <div class="swiper-slide">
            <img src="../assets/Bitmap_1.png" alt="" />
          </div>
          <div class="swiper-slide">
            <img src="../assets/Bitmap_1.png" alt="" />
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- 如果需要滚动条 -->
        <div class="swiper-scrollbar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import Swiper from "swiper";
export default {
  data: () => {
    return {
      docked: false,
      open: false,
      position: "left",
      headerText: "Welcome",
    };
  },
  components: { [Toast.name]: Toast },
  props: {},
  methods: {
    goToMine() {
      this.$router.push("/Mine");
    },
    goToDistribution() {
      this.$router.push("/Distribution");
    },
  },
  mounted() {
    new Swiper(".swiper-container", {
      loop: true,
      // 如果需要分页器
      pagination: ".swiper-pagination",
      // 如果需要前进后退按钮
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      // 如果需要滚动条
      scrollbar: ".swiper-scrollbar",
      slidesPerView: 2,
      spaceBetween: 30,
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./../css/homepage.css">
/* @import url("./../css/login.css"); */
</style>
