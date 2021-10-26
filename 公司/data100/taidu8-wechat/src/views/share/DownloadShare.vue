<template>
  <div class="download-share">
    <div class="logo">
      <img
        :src="require('../../assets/images/share/share_st_dowimg.png')"
        alt
      />
    </div>
   
    <div class="download" @click="download">下载App提现</div>
    <dl>
      <dt>
        <img src="../../assets/images/share/inv_disciple_ic_rules.png" alt />
        <span>奖励领取细则</span>
      </dt>
      <dd>1、请在拼任务APP中领取；</dd>
      <dd>2、同一手机设备，仅能领取一次；</dd>
      <dd>3、任何用户作弊行为一经确认，奖励归零。</dd>
    </dl>
  </div>
</template>

<script>

export default {
  name: "download",
  components: {},
  data() {
    return {
      domainName: process.env.VUE_APP_PAGE_BASE_URL,
    };
  },
  created() {
   
  },
  mounted() {},
  methods: {
    download() {
      // this.$router.replace({ name: "HomeShare" });
       window.location.replace(`${this.domainName}/common/share/#/homeshare`)
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.download-share {
  position: relative;
  width: 100%;
  padding-bottom: 0.4rem;
}
.logo {
  width: 100%;
  // height: 7.08rem;
  // background: url(../../static/images/share_st_dowimg.png) no-repeat;
  // background-size: 100% 100%;
  text-align: center;
  box-sizing: border-box;
  // padding-top: 0.4rem;
  img {
    width: 100%;
  }
}

// .logo img {
//   width: 1.72rem;
//   height: 2.4rem;
// }

.download {
  width: 6.29rem;
  height: 0.9rem;
  margin: 0.3rem auto 0;
  text-align: center;
  line-height: 0.9rem;
  background: #ed5757;
  font-size: 0.32rem;
  color: #fff;
  border-radius: 0.45rem;
  &.survey {
    // background: #ffdb33;
    color: #fff; //#e8353a;
  }
}
dl {
  font-size: 0.28rem;
  padding: 0.9rem 0 0 0.6rem;
  box-sizing: border-box;
}
dl dt {
  color: #333;
  margin-bottom: 0.2rem;
  img {
    vertical-align: middle;
    width: 0.36rem;
    margin-right: 0.1rem;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
}
dl dd {
  color: #888;
  line-height: 0.48rem;
}
</style>
