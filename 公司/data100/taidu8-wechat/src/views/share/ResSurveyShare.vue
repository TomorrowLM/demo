<template>
  <div class="res"></div>
</template>

<script>
import { respondSurvey } from "@/api/share";
import { getUrl } from "../../utils/base";
import { Toast } from 'vant';
export default {
  components: {},
  data() {
    return {
      params:{},
      domainName: process.env.VUE_APP_PAGE_BASE_URL,
    };
  },
  created() {
    this.params = getUrl()
   
    respondSurvey(this.params).then(data => {
      console.log(data)
         /**
       * code 3成功 3已答过此问卷 4sls
       * code2 status 1成功红包 2/3配额满被甄别红包
       * code4 status sls4/5/6
       * "finalAmount"总金额,"integral"积分,"multiple"积分倍数,"initAmount"红包金额,"appMultiple"APP倍数,
       */
        if (data.data.code == 3) {
          window.location.replace(`${this.domainName}/common/share/#/olduserdownload/${data.data.detail.finalGold}`)
        } else if (data.data.code == 2) {
          //status为123 有红包奖励
          let status = data.data.detail.status;
          if (status == 1||status == 2 || status == 3) {
            //1：成功  2：失败  3：失败
            this.$router.replace({
              name: "RedpacketShare",
              query: { finalGold: data.data.detail.finalGold,status:status,isFirst:data.data.isFirst }
            });
          }
        } else if (data.data.code == -1) {
          //服务器出现错误请与管理员联系
           Toast("系统错误，请联系管理员")
        } else {
          //status为456 没有红包奖励
          //4:其他(系统错误)
          //5：用户已答题
          //6：问卷过期
          if (
            data.data.detail.status == 5 ||
            data.data.detail.status == 6 ||
            data.data.detail.status == 4
          ) {
             window.location.replace(`${this.domainName}/common/share/#/homeshare/${data.data.detail.status}/openpacket`)
          } else {
            Toast("系统错误，请联系管理员")
          }
        }
    })
    
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
//@import url()
</style>