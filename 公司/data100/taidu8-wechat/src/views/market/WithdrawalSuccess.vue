<template>
  <div class='withdrawal_success_box'>
    <van-empty :description="queryData.description" :image="basicData.withdrawalSuccessImage">
      <p class="tips">{{ queryData.message }}</p>
      <van-button block round type="primary" @click="backMarket">{{ basicData.withdrawalSuccessBackText }}</van-button>
    </van-empty>
  </div>
</template>

<script>
import basicData from './const'

export default {
  name: 'WithdrawalSuccess',
  data () {
    return {
      basicData: basicData,
      queryData: {}
    }
  },
  created () {
    this.queryData = this.$route.query
  },
  methods: {
    backMarket () {
      this.$router.push('/market')
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.withdrawal_success_box{
  padding-top: 200px;
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