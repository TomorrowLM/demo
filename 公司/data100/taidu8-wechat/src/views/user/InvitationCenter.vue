<template>
  <div class='invitationCenter'>
    <van-tabs v-model="active">
      <template v-for="item in invitationTabData">
        <van-tab v-if="item.showFlag" :key="item.type" :title="tabEnum[item.type]" :name="item.type">
          <InviteFriends v-if="item.type === 1" />
          <EarningDividends v-if="item.type === 2" />
          <InvitationList v-if="item.type === 3" />
        </van-tab>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import InviteFriends from './InviteFriends';
import InvitationList from './InvitationList';
import EarningDividends from './EarningDividends';

export default {
  name: 'InvitationCenter',
  components: { InviteFriends, InvitationList, EarningDividends },
  data () {
    return {
      active: '1',
      tabEnum: {
        1: '邀请好友',
        2: '赚分红',
        3: '邀请列表'
      }
    }
  },
  computed: {
    invitationTabData () {
      return this.$store.getters.invitationTabData
    }
  },
  watch: {
    invitationTabData(data) {
      const defaultData = data.find(item => item.defaultShowFlag)
      this.active = defaultData.type
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetInvitationTabShowStatus')
  },
  methods: {

  },
}
</script>

<style lang='scss' scoped>
//@import url()
.invitationCenter{
  height: 100%;
  overflow: hidden;
  /deep/ .van-tabs{
    height: 100%;
    overflow: hidden;
  }
  /deep/ .van-tabs__content{
    height: calc(100% - 44px);
    .van-tab__pane{
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>