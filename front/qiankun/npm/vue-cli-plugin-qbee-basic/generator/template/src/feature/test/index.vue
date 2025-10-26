<template>
  <div :class="style['test-function-index']">
    我是父元素
    <span class="children">我是子元素</span>
    {{ fetchStatus }}
    <el-button
      type="primary"
      @click="handleBtnClick"
      :loading="fetchStatus === RequestStatus.PENDING"
      >修改列表状态</el-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { changeListItemStatus } from "@/services/TestService";
import { RequestStatus } from "fe-qbee-bo";
import { transformError2JSON } from "@qbee/qbee-common-lib";
import { keepAliveUtil } from "@qbee/qbee-common-lib";

@Component({
  mixins: [keepAliveUtil.keepAliveMixin],
})
export default class VueCom extends Vue {
  public style = require("./index.module.scss");
  public fetchStatus = RequestStatus.FINISH;
  public RequestStatus = RequestStatus;
  public handleBtnClick() {
    this.fetchStatus = RequestStatus.PENDING;
    changeListItemStatus()
      .then(() => {
        this.$message.success("操作成功");
        this.fetchStatus = RequestStatus.FINISH;
      })
      .catch((e) => {
        const temp = transformError2JSON(e);
        this.$message.error(temp.errorMessage);
        this.fetchStatus = RequestStatus.FAILED;
      });
  }
}
</script>
