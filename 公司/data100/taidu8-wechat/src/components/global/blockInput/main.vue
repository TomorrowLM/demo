<template>
  <div class='block_input_box'>
    <van-field ref="block_field" class="block_field" v-model="v" type="digit" :maxlength="maxlength" @input="input" @focus="focused = true;" @blur="focused = false;" />
    <div class="block_input">
      <span v-for="i in maxlength" :key="i" :class="i - 1 === content.length && focused ? 'active' : ''">{{content[i - 1]}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockInput',
  props: {
    maxlength: {
      type: Number,
      default: 4
    },
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value () {
      this.v = this.value
      this.content = this.value.split('');
    }
  },
  data () {
    return {
      v: '',
      content: [],
      focused: false
    }
  },
  created () {
    /*监听input状态，屏幕滚动到input，上下居中
    *在安卓手机上屏幕尺寸变化会产生resize事件。所以监听resize事件。
    *然后定位到input框。
    */
    window.addEventListener('resize', function () {
      console.log(document.activeElement.tagName)
      if(document.activeElement.tagName === 'INPUT'){
        document.activeElement.scrollIntoView({behavior: "smooth"})
      }
    })
  },
  methods: {
    input (val) {
      this.content = val.split('');
      this.$emit('input', val);
    },
    onBlur () {
      this.$refs.block_field.blur();
    },
    onFocus () {
      this.$refs.block_field.focus();
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.block_input_box{
  width: 100%;
  height: 100%;
  position: relative;
  .block_field{
    width: 100%;
    height: 50PX;
    position: absolute;
    background: transparent;
    font-size: 0;
    border: 0;
    padding: 0;
    z-index: 1;
    /deep/ .van-field__body{
      height: 100%;
      .van-field__control{
        padding: 10px 0;
      }
    }
    &::after{
      display: none;
    }
  }
  .block_input{
    display: flex;
    width: 100%;
    height: 50PX;
    justify-content: space-around;
    span{
      flex: 1;
      background: #f5f5f5;
      border-radius: 10px;
      color: #333333;
      margin-left: 10px;
      font-size: 20PX;
      line-height: 50PX;
      text-align: center;
      position: relative;
      &:first-child{
        margin-left: 0;
      }
    }
    .active{
      position: relative;
      &::before{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1PX;
        height: 40%;
        background-color: #323233;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -webkit-animation: 1s van-cursor-flicker infinite;
        animation: 1s van-cursor-flicker infinite;
        z-index: 100;
      }
    }
  }
}
</style>