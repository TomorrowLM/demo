<template>
  <div class='refresh_list_box'>
    <van-pull-refresh v-model="refreshState.refreshing" :disabled="disabled" @refresh="onRefresh">
      <van-list
        v-model="refreshState.loading"
        :finished="finished"
        :error.sync="error"
        :finished-text="finishedText"
        :error-text="errorText"
        @load="onLoad"
      >
        <slot name="content"></slot>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'RefreshList',
  props: {
    refreshState: {},
    finishedText: {
      type: String,
      default: '---  已加载全部  ---'
    },
    errorText: {
      type: String,
      default: '请求失败，点击重新加载'
    },
    finished: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onLoad() {
      this.$emit('on-load')
    },
    onRefresh() {
      this.$emit('on-refresh')
    },
  },
}
</script>

<style lang='scss' scoped>
//@import url()
.refresh_list_box{
}
</style>