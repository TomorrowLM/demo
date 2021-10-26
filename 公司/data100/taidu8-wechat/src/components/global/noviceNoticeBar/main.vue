<template>
  <div class='novice_notice_bar' v-if="flag">
    <van-notice-bar class="notice_bar" color="#fff" :left-icon="require('../../../assets/images/notice_bar_tip_ic.png')" @click="clickbar">
      新手必看！！！为什么很多拼友每天能赚上千金币？
    </van-notice-bar>
  </div>
</template>

<script>
import { joinGroupWechatGroup } from '@/api/survey';

export default {
  name: 'noviceNoticeBar',
  data() {
    return {
      flag: false
    }
  },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getJoinGroupWechatGroup()
  },
  methods: {
    async getJoinGroupWechatGroup () {
      const { data: { flag } } = await joinGroupWechatGroup({ userId: this.userId })
      this.flag = flag;
    },
    clickbar() {
      this.$router.push('/guideGroup')
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.novice_notice_bar{
  .notice_bar{
    background: linear-gradient(90deg, #E33A74 0%, #E97B4A 100%);
  }
}
</style>