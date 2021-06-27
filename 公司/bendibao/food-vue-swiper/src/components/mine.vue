<template>
  <div class="page">
    <div class="drag">
      <div class="cancel">
        <img src="../assets/叉  (1).png" alt="" @click="goHome()" />
      </div>
      <div class="header">
        <img src="../assets/Oval 4.png" alt="" />
        <div>Amy Vasquez</div>
        <hr />
      </div>
      <div class="list">
        <ul>
          <li
            v-for="(items, index) in list"
            :key="index"
            :class="{ active: isActive == index }"
            @click="changeColor(index)"
          >
            {{ items }}
          </li>
        </ul>
      </div>
      <div class="footer">LOG OUT</div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      list: ["HOME", "PROFILE", "FAVOURITES", "SUPPORT", "SETTINGS"],
      active: "active",
      isActive: 0,
    };
  },
  components: {},
  props: {},
  methods: {
    changeColor: function (curIndex) {
      this.isActive = curIndex;
    },
    goHome() {
      console.log(1);
      this.$router.push("/HomePage");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./../css/mine.css">
/* @import url("./../css/login.css"); */
</style>
