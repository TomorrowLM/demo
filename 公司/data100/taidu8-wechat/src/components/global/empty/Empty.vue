<template>
  <div class="empty_box">
    <div class="empty">
      <img src="../../../assets/images/img_empty_noque.png" />
      <p>{{tips}}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "empty",
  props: {
    tips: String
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang='less' scoped>
.empty_box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .empty {
    // padding: 200px 0 0;
    color: #888;
    text-align: center;
    img {
      width: 400px;
      height: auto;
      margin-bottom: 20px;
    }
    p {
      font-size: 26px;
      line-height: 40px;
    }
  }
}
</style>