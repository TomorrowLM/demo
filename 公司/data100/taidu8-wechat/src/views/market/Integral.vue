<template>
  <div class='integral_box'>
    <!-- <div class="integral_info_box">
      <div class="integral_info">
        <dl>
          <dt><img :src="userCoreInfo.headImgUrl" alt=""></dt>
          <dd>
            <h3 class="van-ellipsis">{{ userCoreInfo.nickName }}</h3>
          </dd>
        </dl>
      </div>
      <div class="gold_coin_info">{{ userCoreInfo.gold }}</div>
    </div> -->
    <div class="integral_bg">背景</div>
    <div class="integral_content">
      <van-tabs type="card" class="integral_tabs">
        <van-tab title="收入">
          <income-list :data='userBalance'></income-list>
        </van-tab>
        <van-tab title="兑换">
          <exchange-list :data='userBalance'></exchange-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import IncomeList from './components/IncomeList'
import ExchangeList from './components/ExchangeList'

export default {
  name: 'Integral',
  components: {
    IncomeList,
    ExchangeList
  },
  computed: {
    userCoreInfo () {
      return this.$store.getters.userInfo
    },
    userBalance () {
      return this.$store.getters.userBalance
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetUserCoreInfo')
    dispatch('GetUserBalance')
  }
}
</script>

<style lang='less' scoped>
//@import url()
.integral_box{
  height: 100%;
  background: #F8F8F8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  .integral_bg{
    font-size: 0;
    width: 100%;
    height: 340px;
    background: linear-gradient(180deg, #7575F9 0%, #605BFF 100%);
    border-radius: 0px 0px 30px 30px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .integral_info_box{
    height: 220px;
    padding: 50px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .integral_info{
      dl{
        display: flex;
        align-items: center;
        dt{
          width: 120px;
          height: 120px;
          border-radius: 60px;
          border: 8px solid rgba(255, 255, 255, 0.4);
          box-sizing: border-box;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        dd{
          margin-left: 30px;
          h3{
            color: @white;
            font-size: 26px;
            max-width: 300px;
          }
        }
      }
    }
    .gold_coin_info{
      color: @white;
      font-size: 60px;
      margin-right: 10px;
    }
  }
  .integral_content{
    flex: 1 0;
    overflow: hidden;
    .integral_tabs{
      height: 100%;
      display: flex;
      flex-direction: column;
      /deep/ .van-tabs__wrap{
        width: 144px;
        height: 85px;
        margin: 0 auto;
        padding: 30px 0 20px 0;
        flex-shrink: 0;
        position: absolute;
        right: 0;
        top: 34px;
        z-index: 99;
      }
      /deep/ .van-tab{
        color: #fff;
        opacity: 0.6;
        font-size: 12px;
        border: 1px solid transparent;
      }
      /deep/ .van-tab--active{
        border: 1px solid #fff;
        background: none;
        opacity: 1;
        border-radius: 12px;
        position: relative;
        .van-tab__text{
          margin-right: 8px;
        }
        &::before{
          content: '';
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-top-color: #fff;
          position: absolute;
          right: 8px;
          top: 10px;
        }
      }
      /deep/ .van-tabs__nav{
        height: 24px;
        overflow: hidden;
        background: transparent;
        border: none;
      }
      /deep/ .van-tabs__content{
        flex: 1 0;
        overflow: hidden;
      }
      /deep/ .van-tab__pane{
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>