<template>
  <div id="vue2-pc" :class="{ 'has-sidebar': $route.meta.sidebar, 'is-collapsed': isCollapse }">
    <el-container v-if="isToken && $route.path !== '/login'">
      <el-header v-if="!fullScreenStatus">
        <Header />
      </el-header>
      <el-container>
        <el-aside v-if="!fullScreenStatus" width="220px" style="background: #20243b">
          <Sidebar :collapse.sync="isCollapse" />
        </el-aside>
        <div :style="{ width: fullScreenStatus ? '100%' : 'calc(100% - 220px)' }">
          <TagNav v-if="!fullScreenStatus" />
          <!-- <button @click="goRouter">跳转</button> -->
          <el-main :style="{ padding: padding, height: fullScreenStatus ? '100%' : 'calc(100% - 40px)' }">
            <div class="contentContainer">
              <router-view></router-view>
            </div>
          </el-main>
        </div>
      </el-container>
    </el-container>
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PropSync } from './decorators';
import Header from '@/views/frame/Header.vue';
import Sidebar from '@/views/frame/Sidebar.vue';
import TagNav from '@/views/frame/TagNav.vue';

@Component({
  components: { Sidebar, Header, TagNav },
  computed: {
    isToken() {
      return JSON.stringify(window.localStorage.getItem('token'));
    },
  },
  watch: {
    $route: {
      handler: 'onRouteChange',
      immediate: true,
      deep: true,
    },
  },
})

// 如果你在 App.vue 里还看到 “一个模块不能具有多个默认导出” 这一个 TS 提示，那已经和 PropSync、Sidebar.vue 无关了，
// 只是 VS Code 里的 TS 插件对这个 SFC 的虚拟代码有点挑剔。要是你想把这一个提示也干掉，我可以再帮你在 App.vue 里加 // @ts-nocheck 或改成非 class 写法
export default class Layout extends Vue {
  padding = '20px';
  isCollapse = false;

  @PropSync('name', { type: String }) syncedName!: string;

  onRouteChange() {
    console.log(document.querySelector('.qiankun-app1'), 'qiankun-app1');

    // this.$nextTick(() => {
    //   console.log(document.querySelector('.qiankun-app1'),document.querySelector('.contentContainer'), 'qiankun-app1');
    //   document.querySelector('.contentContainer').appendChild(document.querySelector('.qiankun-app1'));
    // });
  }

  async created() {
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
  }

  mounted() {
    // //给应用的顶层元素添加一个主题标识，用于标识当前的主题
    // document .getElementsByTagName("body")[0].setAttribute("data-theme", "light");
    // js 通过声明sass变量的key值，来找到对应变量，并修改其属性值
    if (JSON.stringify(window.localStorage.getItem('skin'))) {
      document.documentElement.setAttribute('theme', window.localStorage.getItem('skin') || 'light');
      document.documentElement.style.setProperty('--theme-name', window.localStorage.getItem('skin') || 'light');
      document.documentElement.setAttribute('class', window.localStorage.getItem('skin') || 'light');
    } else {
      window.localStorage.setItem('skin', 'light');
      (document.querySelector(':root') as any).style.setProperty('--theme-name', 'light');
    }

    // 动态加载主应用注册的web components
    // if (window.mainAppComponents && window.mainAppComponents.registerWebComponents) {
    //   window.mainAppComponents.registerWebComponents();
    // }
  }

  goRouter() {
    if (this.$route.name === 'page1') {
      this.$router.push('/page2');
    } else if (this.$route.name === 'page2') {
      this.$router.push('/page1');
    }
  }

  get fullScreenStatus() {
    return this.$store.state.fullscreenStatus;
  }
}
</script>

<style lang="scss">
#vue2-pc {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.el-header {
  box-shadow: 1px 1px 5px #ccc;
}
.el-main {
  height: calc(100% - 92px);
  overflow-y: auto;
}

.h100 {
  height: 100%;
}
.el-container {
  height: calc(100% - 30px);
}
</style>
