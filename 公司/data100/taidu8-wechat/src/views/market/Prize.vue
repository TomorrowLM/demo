<template>
  <div class='prize_box'>
    <van-tabs v-model="active" animated>
      <van-tab :title="'奖品'" name='prize'>
        <prize-list></prize-list>
      </van-tab>
      <van-tab :title="'卡券'" name='coupon'>
        <coupon-list></coupon-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import PrizeList from './components/PrizeList'
import CouponList from './components/CouponList'

export default {
  name: 'Prize',
  components: {
    PrizeList,
    CouponList
  },
  data () {
    return {
      active: 'prize'
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.prize_box{
  height: 100%;
  overflow: hidden;
  .van-tabs{
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /deep/ .van-tabs__content{
      flex: 1 0;
    }
    /deep/ .van-tab__pane{
      height: 100%;
    }
  }
}
</style>