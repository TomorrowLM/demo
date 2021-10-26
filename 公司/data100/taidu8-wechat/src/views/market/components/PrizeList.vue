<template>
  <div class='prize_list_box'>
    <refresh-list
      ref="refreshList"
      :finished="finished"
      :error="error"
      :refreshState="refreshState"
      @on-load='onLoad'
      @on-refresh='onRefresh'
    >
      <div class="prize_list" slot="content" v-show="exchangeReward.list">
        <dl v-for="(item, index) in exchangeReward.list" :key="index">
          <dt><img :src="item.picture" alt=""></dt>
          <dd>
            <h3 class='overflow_ellipsis'>{{ item.name }}</h3>
            <p>{{ item.time }}</p>
            <van-button class="prize_button" plain hairline type="primary" size="small" @click="check(item)">查看</van-button>
          </dd>
        </dl>
      </div>
    </refresh-list>
    <no-record
      v-if="loadSuccess && exchangeReward && !exchangeReward.list.length"
      :image="require('../../../assets/images/market/prize_empty_img@2x.png')"
      description="还没有中奖记录"
      tips="要积极参与各种活动，万一中奖了呢"
      btnText="去答题"
      @on-btn-click="goAnswer"
    ></no-record>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'PrizeList',
  data () {
    return {
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
    exchangeReward: {
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
    exchangeReward () {
      return this.$store.getters.exchangeReward
    }
  },
  methods: {
    async getExchangeReward () {
      const { dispatch } = this.$store
      await dispatch('GetExchangeReward', this.params)
      this.loadSuccess = true
      if (!this.exchangeReward.list.length) {
        this.$refs.refreshList.$el.style.display = 'none'
      }
    },
    check (evt) {
      if(evt.type===6){
        Toast('实物商品请前往拼任务APP查看')
        return
      }
      if (evt.orderId) {
        this.$router.push(`/goodsDetail/${evt.orderId}?check=1`)
      } else {
        this.$router.push(`/goodsDetail/0?check=1&data=${JSON.stringify(evt)}`)
      }
    },
    onLoad () {
      if (this.refreshState.refreshing) {
        this.params.page = 1
        this.refreshState.refreshing = false
      } else {
        this.params.page++
      }
      this.getExchangeReward()
    },
    onRefresh () {
      this.onLoad();
    },
    goAnswer () {
      sessionStorage.setItem('tabIndex', 'index')
      this.$router.push('/surveyOne')
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.prize_list_box{
  height: 100%;
  background: @page-bg;
  overflow-y: auto;
  .prize_list{
    width: 100%;
    padding: 0 30px;
    min-height: 35rem;
    dl{
      width: 100%;
      padding: 30px;
      border-radius: 20px;
      background: @white;
      overflow: hidden;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin-top: 30px;
      dt{
        width: 100px;
        height: 100px;
        border-radius: 20px;
        border-radius: @PX solid #e1e7fa;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      }
      dd {
        flex: 1 0;
        padding-left: 20px;
        position: relative;
        h3{
          font-size: 30px;
          color: @title-gray1;
          margin-bottom: 20px;
          max-width:320px;
        }
        p{
          font-size: 24px;
          color: @gray-b2;
          text-indent: 34px;
          position: relative;
          &::before{
            content: '';
            width: 24px;
            height: 24px;
            background: url('../../../assets/images/market/prize_listic_time@2x.png') no-repeat;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
          }
        }
        .prize_button{
          position: absolute;
          right: 2px;
          top: -8px;
          width: 140px;
          height: 56px;
          &::after, &::before{
            border-radius: 60px;
          }
        }
      }
    }
  }
}
</style>