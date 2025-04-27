<template>
  <div class="main-content" style="display: flex; align-items: center; justify-content: center">
    <div class="wrapper">
      <nav>
        <RouterLink v-for="item in routes3d" :key="item.path" :to="'/3D/' + item.path">
          {{ item.path }}
        </RouterLink>
        <!-- <RouterLink to="/3D/canvas/moon">canvas:moon</RouterLink>
        <RouterLink to="/3D/webgl/basic">webgl:webgl</RouterLink>
        <RouterLink to="/3D/webgl/attribute">webgl:attribute</RouterLink>
        <RouterLink to="/3D/webgl/uniform">webgl:uniform:点击画布</RouterLink>
        <RouterLink to="/3D/three/axis">坐标轴</RouterLink>
        <RouterLink to="/3D/three/cube">坐标轴:正方体</RouterLink> -->
      </nav>
    </div>
    <RouterView />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { routes } from '@/router/index.ts'

console.log(routes, 123)
const routes3d = routes[3].children
</script>

<style scoped>
canvas {
  border: 2px dashed #87af8c;
  height: 100%;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  white-space: nowrap;
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
