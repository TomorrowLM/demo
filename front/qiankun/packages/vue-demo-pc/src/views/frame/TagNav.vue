<template>
  <div>
    <el-tag
      v-for="(tag, index) in tabNav"
      :class="[currentRouteInfo.meta.menuName === tag.meta.menuName ? 'active_tag' : 'tag']"
      :key="tag.path"
      type=""
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      <router-link :to="tag.path">
        <span :style="{ color: currentRouteInfo.meta.menuName !== tag.meta.menuName ? '#222' : '#697dff' }">{{
          tag.meta.menuName
        }}</span>
      </router-link>
      <!-- v-if="currentRouteInfo.name === tag.name" -->
      <i key="tag.name" class="el-icon-close" @click="deleteTag(index)"></i>
    </el-tag>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Layout extends Vue {
  mounted() {
    // console.log(this.currentRouteInfo);
  }

  get currentRouteInfo() {
    return this.$store.getters.currentRouteInfo;
  }

  get tabNav() {
    return this.$store.getters.tagNav;
  }

  handleClose(tag) {
    // console.log();
  }

  deleteTag(index: number) {
    this.$store.commit('deleteTag', index);
    this.$router.push(this.currentRouteInfo);
  }
}
</script>

<style lang="scss" scoped></style>
