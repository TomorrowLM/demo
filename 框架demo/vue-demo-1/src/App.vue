<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <p>2</p>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import "./registerServiceWorker"
console.log(process.env.VUE_APP_API_BASE_URL);
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
