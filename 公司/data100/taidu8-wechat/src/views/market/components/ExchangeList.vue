<template>
  <div class='exchange_list_box'>
    <div class="exchange_info">
      <h4>-{{ data.withdrawGold }}</h4>
      <p>累计兑换</p>
    </div>
    <div class="exchange_details">
      <!-- <h3 class="title">兑换明细</h3> -->
      <div class="details_box">
        <refresh-list
          ref="refreshList"
          :finished="finished"
          :error="error"
          :disabled="disabled"
          :refreshState="refreshState"
          @on-load='onLoad'
        >
          <div class="details_list" slot="content" v-show="userGoldExpensesRecord.list">
            <van-cell v-for="(item, index) in userGoldExpensesRecord.list" :key="index" :title="item.title" :value="item.gold + '金币'" size="large" :label="item.date" />
          </div>
        </refresh-list>
        <no-record v-if="loadSuccess && userGoldExpensesRecord && !userGoldExpensesRecord.list.length"></no-record>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExchangeList',
  props: {
    data: {}
  },
  data () {
    return {
      params: {
        page: 0,
        limit: 10
      },
      finished: false,
      error: false,
      disabled: true,
      refreshState: {
        loading: false,
        refreshing: false
      },
      loadSuccess: false
    }
  },
  watch: {
    userGoldExpensesRecord: {
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
    userGoldExpensesRecord () {
      return this.$store.getters.userGoldExpensesRecord
    }
  },
  created () {
  },
  methods: {
    async getUserGoldExpensesRecord () {
      const { dispatch } = this.$store
      await dispatch('GetUserGoldExpensesRecord', this.params)
      this.loadSuccess = true
      if (!this.userGoldExpensesRecord.list.length) {
        this.$refs.refreshList.$el.style.display = 'none'
      }
    },
    onLoad () {
      this.params.page++
      this.getUserGoldExpensesRecord()
    },
  },
}
</script>

<style lang='less' scoped>
//@import url()
.exchange_list_box{
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 30px 30px 30px;
  .exchange_info{
    height: 200px;
    text-align: left;
    padding-top: 50px;
    h4{
      font-size: 64px;
      color: #fff;
    }
    p{
      font-size: 24px;
      color: #fff;
      opacity: 0.6;
      margin: 10px 0 20px 0;
    }
  }
  .exchange_details{
    background: #fff;
    flex: 1 0;
    padding: 10px 30px;
    border-radius: 20px;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .title{
      height: 42px;
      font-size: 30px;
      color: @title-gray1;
      text-indent: 30px;
      line-height: 42px;
      margin-bottom: 20px;
      position: relative;
      font-weight: bold;
      &::before{
        content: '';
        width: 10px;
        height: 34px;
        background: @violet;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        border-radius: 5px;
        margin: auto 0;
      }
    }
    .details_box{
      flex: 1 0;
      overflow-y: auto;
    }
    .details_list{
      /deep/ .van-cell{
        padding-left: 0;
        padding-right: 0;
        &::after{
          left: 0;
          right: 0;
        }
      }
      /deep/ .van-cell__title{
        span{
          font-size: 14px;
          color: @title-gray1;
        }
        .van-cell__label{
          font-size: 12px;
          color: @gray-b2;
        }
      }
      /deep/ .van-cell__value{
        span{
          font-size: 14px;
          color: @title-gray1;
        }
      }
    }
  }
}
</style>