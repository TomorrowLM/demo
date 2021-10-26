<template>
  <div class='no_record_box'>
    <van-empty :description="description" :image="image">
      <p class="tips" v-if="tips">{{ tips }}</p>
      <van-button v-if="btnText" block round type="primary" @click="btnClick">{{ btnText }}</van-button>
    </van-empty>
  </div>
</template>

<script>
export default {
  name: 'NoRecord',
  props: {
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: require('../../../assets/images/my_integral_img_norecord@2x.png')
    },
    tips: {
      type: String,
      default: '暂无记录'
    },
    btnText: {
      type: String,
      default: ''
    }
  },
  methods: {
    btnClick () {
      this.$emit('on-btn-click')
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.no_record_box{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /deep/ .van-empty__description{
    font-size: 15px;
    color: @title-gray1;
  }
  .tips{
    font-size: 24px;
    color: @title-gray2;
    margin-bottom: 90px;
  }
}
</style>