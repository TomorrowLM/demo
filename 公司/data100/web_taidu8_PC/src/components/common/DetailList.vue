<template>
  <ul>
    <li>{{item.title}}</li>
    <li>{{item.date}}</li>
    <li :class="[String(item.amount).indexOf('-')!=-1?'down':'up']">
      <!-- <span v-if="String(item.amount).indexOf('-')!=-1">-</span> -->
      <span v-if="String(item.amount).indexOf('-')==-1">+</span>
      {{item.amount}}
    </li>
  </ul>
</template>
<script>
export default {
  name: "detaillist",

  props: {
    pageName: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}

li {
  // float: left;

  // line-height: 60px;
  vertical-align: middle;
  display: inline-block;
  font-size: 16px;
  word-wrap: break-word;

  &:nth-child(1) {
    width: 30%;
    margin-left: 4%;
    line-height: 24px;
    overflow: hidden;
  }
  &:nth-child(2) {
    width: 40%;
    margin-left: 3%;
    height: 50px;
    line-height: 50px;
  }
  &:nth-child(3) {
    width: 20%;
    height: 50px;
    line-height: 50px;
    &.up {
      color: #7575f9;
    }
    &.down {
      color: #576b95;
    }
  }
}

// ul {
//   @include size(100%, 60px);
//   border-bottom: 1px dashed #ddd;
//   color: #666;
// }
</style>

