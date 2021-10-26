<template>
  <div class='invitation_list'>
    <van-cell-group v-if="apprenticeList.length">
      <van-cell center v-for="(item, index) in apprenticeList" :key="index" :title="item.nickName" :label="item.bonusFlag">
        <template #icon>
          <img :src="item.headImgUrl" alt="">
        </template>
        <template #default>
          贡献金币 <span class="gold">{{ item.amount }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <div v-else>
      <empty tips="暂未邀请到好友" />
      <van-button
        class="make_money_now"
        color="linear-gradient(to right, #AB64F5, #6C63FF)"
        type="default"
        round
        @click="backSurveyOne"
      >立即邀友赚钱</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvitationList',
  data () {
    return {
      params: {
        page: 1,
        limit: 100
      },
    }
  },
  computed: {
    apprenticeList () {
      return this.$store.getters.apprenticeList
    }
  },
  created () {
    this.getApprenticeList()
  },
  methods: {
    getApprenticeList() {
      const { dispatch } = this.$store
      dispatch('GetApprenticeList', this.params)
    },
    backSurveyOne() {
      sessionStorage.setItem('tabIndex', 'index')
      sessionStorage.setItem("survey_name", "history");
      this.$router.push('/surveyOne')
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.invitation_list{
  height: 100%;
  position: relative;
  overflow: auto;
  .empty_box{
    padding-top: 30%;
  }
  .make_money_now{
    width: 70%;
    position: absolute;
    bottom: 40px;
    left: 15%;
  }
  .van-cell-group{
    /deep/ .van-cell{
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .van-cell__title{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .gold{
        color: @taidu8-red;
      }
    }
  }
}
</style>