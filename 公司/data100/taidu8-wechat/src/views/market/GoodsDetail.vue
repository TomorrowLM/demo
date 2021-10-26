<template>
  <div class='goods_box'>
    <div v-if="goodsInfo.commodityId && check !== '1'">
      <div class="goods_img">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in goodsInfo.picList" :key="index">
            <img :src="image" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="goods_info">
        <h3  class='overflow_ellipsis'>{{ goodsInfo.name }}</h3>
        <p v-if="discountPrice"><span>{{ discountPrice }} 金币</span><i>{{ goodsInfo.gold }} 金币</i></p>
        <p v-else><span>{{ goodsInfo.gold }} 金币</span><i style="text-decoration:line-through" v-if='goodsInfo.type === "6"'>市场价：{{ goodsInfo.price }} 元</i></p>
      </div>
      <div class="select_coupon" v-if="goodsInfo.type === '1'">
        <van-cell
          title="卡券"
          :is-link='coupons.length ? true : false'
          :value="couponValue"
          :value-class="chosenCoupon !== -1 && 'active'"
          @click="coupons.length ? showCouponList = true : showCouponList = false;"
        />
        <select-coupon
          :coupons='coupons'
          :visible='showCouponList'
          :chosenCoupon='chosenCoupon'
          @on-confirm='selectConfirm($event)'
          @on-select-coupon='selectCoupon($event)'
        ></select-coupon>
      </div>
      <div class="goods_btns" :style='goodsInfo.type === "6"?"position:fixed;z-index:100;bottom:0;left:0;right:0;padding:10px 30px;background:#fff;":"position:static"'>
        <van-button class="exchange_button" block round type="primary" :disabled="goodsInfo.btnStat === '0'" @click="redeemNow">{{ goodsInfo.btnDoc }}</van-button>
      </div>
      <div class="rule_box">
        <h4>兑换规则</h4>
        <p>{{ goodsInfo.rule }}</p>
      </div>
      <div v-if='goodsInfo.type === "6"' class="goods_details">
        <div class="rule_box">
          <h4>商品详情</h4>
          <div v-html="goodsInfo.detailPicture"></div>
        </div>
      </div>
    </div>
    <div class="goods_detail_box" v-if="exchangeRewardDetail.commodityId && check === '1'">
      <div class="goods_detail_img">
        <img :src="exchangeRewardDetail.picture" alt="">
      </div>
      <div class="goods_detail_info">
        <h3>{{ exchangeRewardDetail.name }}</h3>
        <p>{{ exchangeRewardDetail.time }}</p>
      </div>
      <div class="goods_detail_info_password" v-if="exchangeRewardDetail.type === 1">
        <h4 class="label" v-if="exchangeRewardDetail.label">{{ exchangeRewardDetail.label }}</h4>
        <div class="goods van-hairline--bottom">
          {{ exchangeRewardDetail.goods }}
          <van-button
            class="copy_btn"
            size="mini"
            plain
            hairline
            round
            type="primary"
            v-if="exchangeRewardDetail.type === 1"
            v-clipboard:copy="exchangeRewardDetail.goods" 
            v-clipboard:success="onCopy" 
            v-clipboard:error="onCopyError"
          >复制</van-button>
        </div>
      </div>
      <div class="goods_detail_info_tips" v-if="exchangeRewardDetail.type === 3">
        <p>话费将于十日内充值到您注册拼任务的手机上，请您留意话费余额。</p>
      </div>
      <div class="user_address_info" v-if="exchangeRewardDetail.type === 2">
        <h4 class="label">收货信息</h4>
        <div class="address van-hairline--bottom">
          <div class="imperfect" v-if="!userAddress">未完善</div>
          <div class="info" v-else>
            <p>{{ userAddress.receivingName }}  {{ userAddress.receivingPhone }}</p>
            <p>{{ userAddress.receivingAddress }}</p>
          </div>
          <van-button
            class="operation_btn"
            size="mini"
            plain
            hairline
            round
            type="primary"
            @click="perfectAddress"
          >{{ userAddress ? '去修改' : '未完善' }}</van-button>
        </div>
      </div>
     
    </div>
    <div id="backtop" class="top" @click="backtop"><img :src="require('../../assets/images/market/to_top@2x.png')"/></div>
  </div>
</template>

<script>
import SelectCoupon from './components/SelectCoupon'
import basicData from './const'
import { Toast, Dialog } from 'vant'
import config from '@/config/defaultSettings'
import { getCheckSaveAddress } from '@/api/user'
import $ from "jquery";
export default {
  name: 'GoodsDetail',
  components: { SelectCoupon },
  data () {
    return {
      discountPrice: '',
      showCouponList: false,
      chosenCoupon: -1,
      coupons: [],
      check: '',
      couponValue: '',
      userAddress: '',
      appPageUrl: config.appPageUrl
    }
  },
  watch: {
    cardTicket: {
      handler(data) {
        this.coupons = data.list.filter(item => item.status === 1 && item.type === 3)
        this.couponValue = this.coupons.length ? `${this.coupons.length}张可用` : '无可用卡券'
      },
      deep: true
    },
  },
  computed: {
    goodsInfo () {
      return this.$store.getters.goodsInfo
    },
    exchangeRewardDetail () {
      return this.$store.getters.exchangeRewardDetail
    },
    cardTicket () {
      return this.$store.getters.cardTicket
    }
  },
  created () {
    const { dispatch, commit } = this.$store
    const { params: { id }, query: { check, data } } = this.$route
    this.check = check
    if (id === '0') {
      const exchangeRewardDetail = JSON.parse(data)
      exchangeRewardDetail.commodityId = 1
      commit('SET_EXCHANGE_REWARD_DETAILS', exchangeRewardDetail)
      this.getCheckSaveAddress()
    } else {
      if (check === '1') {
        dispatch('GetExchangeRewardDetail', { orderId: id })
      } else {
        dispatch('GetGoodsInfo', { commodityId: id }).then(() => {
          this.goodsInfo.type === '1' && dispatch('GetCardTicket', { page: 1, limit: 100 })
        })
      }
    }
  },
  mounted(){
    this.backtop()
  },
  methods: {
     backtop(){
      // 为当前页面绑定滚动事件
      $('.goods_box').scroll(function() {
        // 获取页面滚动高度
        let osTop = $('.goods_box').scrollTop();
        if(osTop > 300 ){
          $("#backtop").fadeIn(500);
        }else {
          $("#backtop").fadeOut(500);
        }
      })
      // 定义回到顶部动画
     $("#backtop").click(function(){
       $('.goods_box').animate({scrollTop:'0px'},'slow')
      })
    },
    async redeemNow () {
      const { name, gold } = this.goodsInfo
      const { dispatch } = this.$store
      const { id } = this.$route.params
      if (this.goodsInfo.type === '1') {
        Dialog.confirm({
          title: '提示',
          message: `您将兑换商品：${name}\n兑换将消耗金币：${ this.discountPrice || gold }金币`,

        }).then(async () => {
          let cardId = this.chosenCoupon === -1 ? '' : this.chosenCoupon
          const result = await dispatch('GetCommodityExchange', { commodityId: id, cardId })
          this.$router.push({
            path: '/withdrawalSuccess',
            query: {
              description: '兑换成功',
              message: result.msg
            }
          })
        })
      } else if(this.goodsInfo.type === '6'){//实物
       Dialog.confirm({
          title: '提示',
          message: `实物商品只能在拼任务APP兑换`,
          confirmButtonText:"去APP兑换",
        }).then(async () => {
          window.location.href = `${process.env.VUE_APP_PAGE_BASE_URL}/common/share/#/homeshare`
        })
      }else {
        const { ACTION_TYPE: { REDEEM_NOW }, WITHDRAWAL_TYPE: { NO_WECHART } } = basicData
        const params = {
          actionType: REDEEM_NOW,
          withdrawType: NO_WECHART,
          commodityId: id
        }
        await dispatch('GetRuleCheck', params)
        this.$router.push(`/withdrawal/${id}`)
      }
    },
    selectCoupon(evt) {
      const { id } = evt
      this.chosenCoupon === id ? this.chosenCoupon = -1 : this.chosenCoupon = id
    },
    selectConfirm(evt) {
      if (!evt) {
        this.discountPrice = ''
        this.couponValue = `${this.coupons.length}张可用`
      } else {
        this.discountPrice = this.goodsInfo.gold - this.goodsInfo.gold * evt.sale
        this.couponValue = `${evt.name}${evt.discount}`
      }
      this.showCouponList = false
    },
    async getCheckSaveAddress() {
      const result = await getCheckSaveAddress()
      this.userAddress = result.data
    },
    onCopy () {
      Toast.success('复制成功')
    },
    onCopyError () {
      Toast.fail('复制失败')
    },
    perfectAddress () {
      Dialog.alert({
        title: '提示',
        message: '请前往拼任务APP完善或修改收货信息。',
        confirmButtonColor: '#7979f5'
      }).then(() => {
        // on close
      });
    }
  }
}
</script>

<style lang='less' scoped>
//@import url()
.goods_box{
  height: 100%;
  background: @page-bg;
  overflow-y: auto;
  .top{
    position: fixed;
    display: none;
    z-index: 110;
    bottom: 100px;
    right: 20px;
    img{
      width:48px;
      height: 48px;

    }
  }
  .goods_img{
    /deep/ .van-swipe-item{
      img{
        width: 100%;
      }
    }
  }
  .goods_info{
    background: #fff;
    padding: 20px 30px;
    h3{
      font-size: 30px;
      color: @title-gray1;
      margin-bottom: 10px;
    }
    p{
      span{
        font-size: 26px;
        color: @taidu8-red;
        margin-right: 20px;
      }
      i{
        font-size: 20px;
        color: @gray-b2;
        font-style: normal;
        text-decoration: line-through;
      }
    }
  }
  .select_coupon{
    margin-top: 30px;
    /deep/ .active{
      color: @taidu8-red;
    }
    /deep/ .van-cell{
      &::after{
        display: none;
      }
    }
  }
  .goods_btns{
    padding: 60px 30px;
  }
  .rule_box{
    padding: 30px;
    h4{
      font-size: 28px;
      color: @title-gray1;
      margin-bottom: 30px;
      padding-left: 50px;
      position: relative;
      &::before{
        content: '';
        width: 30px;
        height: 36px;
        background: url('../../assets/images/market/share_ic_rules@2x.png') no-repeat;
        background-size: cover;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
    p{
      font-size: 26px;
      color: @title-gray2;
      white-space: pre-wrap;
    }
  }
  .goods_details{
    padding:0 0 90px;
    .rule_box{
      h4::before{
        width: 30px;
        height: 32px;
        background: url('../../assets/images/market/goods_detail_img@2x.png') no-repeat;
        background-size: cover;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
   
  }
}
.goods_detail_box{
  height: 100%;
  background: @white;
  overflow-y: auto;
  .goods_detail_img{
    background: #7575F9;
    border-radius: 0px 0px 80px 0px;
    img{
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .goods_detail_info{
    padding: 60px;
     h3{
      font-size: 30px;
      color: @title-gray1;
      font-weight: bold;
      margin-bottom: 10px;
    }
    p{
      font-size: 26px;
      color: @title-gray2;
    }
  }
  .goods_detail_info_password{
    padding: 0 60px;
    .label{
      color: @violet;
      font-size: 24px;
    }
    .goods{
      font-size: 26px;
      color: @title-gray1;
      padding: 20px 150px 20px 0;
      position: relative;
      word-break: break-all;
      .copy_btn{
        width: 100px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
  .goods_detail_info_tips{
    width: 630px;
    border: 3px solid #7676F9;
    border-radius: 20px;
    padding: 20px 120px 20px 30px;
    margin: 0 auto;
    background: url('../../assets/images/market/tips.png') no-repeat;
    background-size: 70px 62px;
    background-position-x: 528px;
    background-position-y: center;
    p{
      font-size: 24px;
      color: #7676F9;
      line-height: 42px;
    }
  }
  .user_address_info{
    padding: 0 60px;
    .label{
      color: @title-gray1;
      font-size: 28px;
    }
    .address{
      font-size: 26px;
      color: @title-gray1;
      font-family: PingFangSC-Regular, PingFang SC;
      padding: 20px 150px 20px 0;
      position: relative;
      word-break: break-all;
      .imperfect{
        color: @title-gray2;
        font-size: 26px;
      }
      .info{
        line-height: 40px;
      }
      .operation_btn{
        width: 150px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
}
</style>