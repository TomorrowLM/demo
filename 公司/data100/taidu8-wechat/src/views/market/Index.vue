<template>
  <div class='market_box'>
    <novice-notice-bar v-if="userCoreInfo.userId" :userId="userCoreInfo.userId" />
    <div class="market_box_content">
      <div class="ueer_info_box">
        <div class="ueer_info">
          <dl>
            <dt><img :src="userCoreInfo.headImgUrl" alt=""></dt>
            <dd>
              <h3 class="van-ellipsis">{{ userCoreInfo.nickName }}</h3>
            </dd>
          </dl>
        </div>
        <div class="gold_coin_info">
          <span>{{ userCoreInfo.gold }}</span>金币
        </div>
      </div>
      <div class="market_tabs_box">
        <router-link to="/prize">
          <dl class="prize">
            <dt><img src="../../assets/images/market/Integral_ic_prize@2x.png" alt=""></dt>
            <dd>我的奖品</dd>
          </dl>
        </router-link>
        <router-link to="/integral">
          <dl class="gold_coin">
            <dt><img src="../../assets/images/market/Integral_ic_detail@2x.png" alt=""></dt>
            <dd>金币明细</dd>
          </dl>
        </router-link>
      </div>
      <div class="market_goods_box" v-show="homePage.list">
        <div class="goods_box" v-for="item in homePage.list" :key="item.name">
          <div class="goods_header van-hairline--bottom" v-if="item.selectList.length">
            <h4 :class="item.type === '0' ? 'goods_title select' : 'goods_title video'">{{ item.name }}</h4>
            <span class="goods_more" v-if="item.showMoreFlag === '1'" @click="seeAll(item.type)">查看全部</span>
          </div>
          <div class="goods_list" v-if="item.selectList.length">
            <div class="goods" v-for="list in item.selectList" :key="list.commodityId" @click="pushGoodsDetail(list)">
              <div class="goods_guide">
                <img :src="list.picture" alt="">
                <img v-if="list.isShowhandFlag==='1'" src="../../assets/images/market/goods_guide.png" alt="">
              </div>
             
              <h4>{{ list.name }}</h4>
              <h5>{{ list.gold }}金币</h5>
              <h5 v-if='list.commodityType==6' style='text-decoration:line-through;color:rgba(153,153,153,1)'>市场价：{{list.price}}元</h5>
            </div>
          </div>
        </div>
      </div>
      <van-divider v-show="homePage.list" :style="{ color: '#a9a9a9', fontSize: '10px', padding: '0 60px' }">期待更多</van-divider>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'vant'
export default {
  name: 'Market',
  computed: {
    userCoreInfo () {
      return this.$store.getters.userInfo
    },
    homePage () {
      return this.$store.getters.homePage
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetUserCoreInfo')
    dispatch('GetHomePage')
  },
  methods: {
    pushGoodsDetail (item) {
      // if(type=='2'){
      //   Toast('实物商品只能在拼任务APP兑换')
      // }else{
        const { commodityId } = item
        this.$router.push(`/goodsDetail/${commodityId}`)
      // }
      
    },
    seeAll (type) {
      this.$router.push(`/goodsList/${type}`)
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.market_box{
  height: 100%;
  background: @page-bg;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .market_box_content{
    overflow-y: auto;
    flex: 1 0;
  }
  .ueer_info_box{
    height: 280px;
    padding: 50px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: url('../../assets/images/market/Integral_topbg@2x.png') no-repeat;
    background-size: 100% auto;
    .ueer_info{
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
            font-size: 32px;
            max-width: 300px;
          }
        }
      }
    }
    .gold_coin_info{
      font-size: 26px;
      color: @white;
      span{
        font-size: 50px;
        margin-right: 10px;
      }
    }
  }
  .market_tabs_box{
    width: 690px;
    height: 118px;
    border-radius: 20px;
    background: @white;
    display: flex;
    position: relative;
    bottom: 60px;
    margin: 0 auto;
    a{
      flex: 1 0;
    }
    dl{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      dt{
        width: 32px;
        height: 32px;
        margin-right: 15px;
        position: relative;
        bottom: @PX;
        img{
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      dd{
        color: @violet;
        font-size: 28px;
        line-height: 118px;
        text-align: center;
      }
    }
  }
  .market_goods_box{
    position: relative;
    bottom: 60px;
    .goods_box{
      padding: 0 30px;
      margin: 25px 0;
      background: #fff;
      .goods_header{
        height: 90px;
        display: flex;
        .goods_title{
          width: 50%;
          font-size: 28px;
          color: @title-gray1;
          line-height: 90px;
          text-indent: 48px;
          position: relative;
        }
        .select{
          &::before{
            content: '';
            width: 32px;
            height: 32px;
            background: url('../../assets/images/market/Integral_ic_high-quagoods@2x.png') no-repeat;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 28px;
          }
        }
        .video{
          &::before{
            content: '';
            width: 32px;
            height: 32px;
            background: url('../../assets/images/market/Integral_ic_entertainment@2x.png') no-repeat;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 28px;
          }
        }
        .goods_more{
          width: 50%;
          font-size: 24px;
          color: @title-gray2;
          line-height: 90px;
          padding-right: 40px;
          text-align: right;
          position: relative;
          &::before{
            content: '';
            width: 16px;
            height: 26px;
            background: url('../../assets/images/ic_arrowr@2x.png') no-repeat;
            background-size: cover;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
          }
        }
      }
      .goods_list{
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 40px;
        .goods{
          width: 50%;
          margin-top: 40px;
          padding: 0 15px;
          text-align: center;
         
          .goods_guide{
            position: relative;
            width: 100%;
            height: 204px;
           
            img:nth-child(1) {
              width: 100%;
              height: 100%;
              display: block;
              border-radius: 20px;
              object-fit: cover;
            }
            img:nth-child(2){
              width:72px;
              height:88px;
              position: absolute;
              right:15px;
              bottom:-30px;
            }
          }
          
          h4{
            font-size: 30px;
            color: @title-gray1;
            margin: 30px 0 20px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          h5{
            font-size: 26px;
            color: #ed5757;
          }
        }
      }
    }
  }
}
</style>