<template>
  <div class='coupon_list_box'>
    <refresh-list
      ref="refreshList"
      :finished="finished"
      :error="error"
      :refreshState="refreshState"
      @on-load='onLoad'
      @on-refresh='onRefresh'
    >
      <div class="coupon_list" slot="content" v-show="cardTicket.list">
        <dl v-for="(item, index) in cardTicket.list" :key="index" :class="{ 'dis': item.status === -1, 'use': item.status === 0 }">
          <dt>
            <h2>{{ item.discount }}</h2>
            <van-button v-if="item.status === 1" class="coupon_button" plain hairline type="primary" size="small" @click="cardTicketClick(item.type)">{{ basicData.btnTextData[item.type] }}</van-button>
            <p v-else>{{ item.status === -1 ? '已过期' : '已使用' }}</p>
          </dt>
          <dd>
            <h3>{{ item.name }}</h3>
            <p v-text="item.descStr"></p>
          </dd>
        </dl>
      </div>
    </refresh-list>
    <no-record
      v-if="loadSuccess && cardTicket && !cardTicket.list.length"
      :image="require('../../../assets/images/market/prize_empty_img@2x.png')"
      description="还没有中奖记录"
      tips="要积极参与各种活动，万一中奖了呢"
      btnText="去答题"
      @on-btn-click="goAnswer"
    ></no-record>
  </div>
</template>

<script>
import config from '@/config/defaultSettings'
import basicData from '../const'
import { Dialog } from 'vant'

export default {
  name: 'CouponList',
  data () {
    return {
      basicData: basicData,
      params: {
        page: 0,
        limit: 10
      },
      finished: false,
      error: false,
      refreshState: {
        loading: false,
        refreshing: false,
      },
      loadSuccess: false
    }
  },
  watch: {
    cardTicket: {
      handler(data) {
        this.refreshState.loading = false
        if (data.list.length >= data.totalCount) {
          this.finished = true;
        }
      },
      deep: true
    }
  },
  computed: {
    cardTicket () {
      return this.$store.getters.cardTicket
    }
  },
  created () {
  },
  methods: {
    async getCardTicket () {
      const { dispatch } = this.$store
      await dispatch('GetCardTicket', this.params)
      this.loadSuccess = true
      if (!this.cardTicket.list.length) {
        this.$refs.refreshList.$el.style.display = 'none'
      }
    },
    cardTicketClick (type) {
      if (type === 1) {
        sessionStorage.setItem('tabIndex', 'index')
        this.$router.push('/surveyOne')
      } else if (type === 2) {
        Dialog.confirm({
          title: basicData.signInTitle,
          message: basicData.signInMessage,
          confirmButtonText: basicData.signInConfirmButtonText
        })
        .then(() => {
          window.location.href = config.appPageUrl
        })
      } else if (type === 3) {
        this.$router.push('/market')
      } else if (type === 5) {
        sessionStorage.setItem('tabIndex', 'index')
        sessionStorage.setItem('survey_name', 'survryone')
        this.$router.push('/surveyOne')
      } else if (type === 6) {
        sessionStorage.setItem('tabIndex', 'index')
        sessionStorage.setItem('survey_name', 'survrytwo')
        this.$router.push('/surveyOne')
      }
    },
    onLoad () {
      if (this.refreshState.refreshing) {
        this.params.page = 1
        this.refreshState.refreshing = false
      } else {
        this.params.page++
      }
      this.getCardTicket()
    },
    onRefresh () {
      this.onLoad();
    },
    goAnswer () {
      sessionStorage.setItem('tabIndex', 'index')
      this.$router.push('/surveyOne')
    }
  }
}
</script>

<style lang='less' scoped>
//@import url()
.coupon_list_box{
  height: 100%;
  background: @page-bg;
  overflow-y: auto;
  .coupon_list{
    width: 100%;
    padding: 0 30px;
    min-height: 35rem;
    dl{
      width: 100%;
      height: 207px;
      background: url('../../../assets/images/market/my_coupon_bg1.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      margin-top: 30px;
      dt{
        width: 220px;
        text-align: center;
        h2{
          color: @orange;
          font-family: PingFangSC-Medium;
          font-size: 46px;
          margin-bottom: 20px;
        }
        p{
          color: @orange-dark;
          font-size: 24px;
        }
        .coupon_button{
          width: 140px;
          height: 56px;
          background-color: transparent;
          color: @orange;
          &::after, &::before{
            border-radius: 60px;
            border-color: @orange;
          }
        }
      }
      dd{
        flex: 1 0;
        padding-left: 40px;
        h3{
          color: @orange;
          font-size: 28px;
          margin-bottom: 10px;
        }
        p{
          color: @orange-dark;
          font-size: 20px;
          transform: scale(0.83);
          position: relative;
          right: 35px;
          line-height: 28px;
          white-space: pre-wrap;
        }
      }
    }
    .dis{
      background: url('../../../assets/images/market/my_coupon_bg_dis@2x.png') no-repeat;
      background-size: 100% 100%;
      dt{
        h2{
          color: @title-gray2;
        }
        p{
          color: #ccc;
        }
      }
      dd{
        h3, p{
          color: #ccc;
        }
      }
    }
    .use{
      background: url('../../../assets/images/market/my_coupon_bg2@2x.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>