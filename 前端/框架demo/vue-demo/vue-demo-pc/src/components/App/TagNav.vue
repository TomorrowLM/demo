<template>
  <div class="tag_nav">
    <el-tag
      :class="[currentRouteInfo.name === tag.name ? 'active_tag' : 'tag']"
      :key="tag.path"
      type=""
      v-for="(tag, index) in tabNav"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      <router-link :to="tag.path">
        <span :style="{ color: currentRouteInfo.name !== tag.name ? '#222' : '#697dff' }">{{ tag.name }}</span>
      </router-link>
      <!-- <img
        key="tag.name"
        @click="deleteTag(index)"
        v-if="currentRouteInfo.name === tag.name"
        src="../../assets/home/ref_msg _close.png"
        alt=""
      /> -->
    </el-tag>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { routeList } from '@/router';

@Component({})
export default class Layout extends Vue {
  created() {
    // const asq = this.$store.getters.tagNav;
    // function recursionTagNav(val: string, index: any, routeList: Array<any>) {
    //   for (let i = 0; i < routeList.length; i++) {
    //     if (val.includes(routeList[i].path)) {
    //       asq[index] = routeList[i].name;
    //       break;
    //     }
    //     if (routeList[i].children) {
    //       recursionTagNav(val, index, routeList[i]);
    //     }
    //   }
    // }
    // asq.map((val: string, index: number) => {
    //   recursionTagNav(val, index, routeList);
    // });
  }

  mounted() {
    // document.getElementsByClassName('tag_nav')[0].addEventListener('mousemove', e => {
    //   // console.log(e);
    // });
  }

  get currentRouteInfo() {
    // console.log(this.$store.getters.currentRouteInfo);
    return this.$store.getters.currentRouteInfo;
  }

  get tabNav() {
    return this.$store.getters.tagNav;
  }

  handleClose() {
    // console.log();
  }

  deleteTag(index: number) {
    this.$store.commit('deleteTag', index);
    this.$router.push(this.currentRouteInfo);
  }
}
</script>

<style lang="scss" scoped>
.tag_nav {
  display: flex;
}

.el-cs-tag + .el-cs-tag {
  margin-left: 10px;
}

.button-tag {
  vertical-align: middle;
  transform: translateY(-2px);
}
.button-new-tag {
  border-radius: 2px;
  font-size: 12px;
  margin-left: 10px;
  height: 20px;
  line-height: 20px;
  // padding-top: 0;
  // padding-bottom: 0;
  padding: 0 8px;
  vertical-align: middle;
}
.input-new-tag {
  width: 90px;
  height: 20px;
  font-size: 12px;
  margin-left: 10px;
  vertical-align: bottom;
  .el-input__inner {
    height: 20px;
    line-height: 20px;
  }
}
img {
  margin-left: 16px;
}
.active_tag {
  font-size: 12px;
  font-weight: 500;
  color: #697dff;
  line-height: 12px;
  border-bottom: 0;
}
.tag {
  color: #000;
}
</style>
