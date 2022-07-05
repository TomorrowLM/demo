<template>
  <div class="header">
    <a-layout-header style="background: #fff; padding: 0">
      <div @click.stop="send" class="icon-collapse">
        <a-icon
          class="trigger"
          :type="collapsedHeader ? 'menu-unfold' : 'menu-fold'"
        />
      </div>
      <div class="menu">
        <a-menu mode="horizontal">
        <a-menu-item key="menu:1">
           首页
          </a-menu-item>
           <a-menu-item key="menu:2">
           问题记录
          </a-menu-item>
      </a-menu>
      </div>
    </a-layout-header>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop() private msg!: string;
  @Prop(Boolean) collapsed: boolean | undefined;
  collapsedHeader = false;
  mounted () {
    // console.log(this.collapsed)
  }

  send () {
    this.collapsedHeader = !this.collapsedHeader
    this.$emit('child-msg', this.collapsedHeader)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.ant-layout-header {
  display: flex;
  align-items: center;
}
.icon-collapse {
  height: 100%;
  width: 50px;
  background: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.anticon {
  font-size: 30px;
  background: #1890ff;
}

.menu{
    border-left: 1px solid #ccc;
    margin-left: 30px;
}

.ant-menu-horizontal{
  border-bottom:0;
}

.ant-menu-horizontal .ant-menu-item, .ant-menu-horizontal .ant-menu-submenu{
      line-height: 24px;
}
</style>
