<template>
  <div class="error">
    <com-header v-if="isHeader"></com-header>
    <img src="../../static/images/img_empty_noque.png" alt="">
    <p>系统错误，请与管理员联系</p>
  </div>
</template>

<script>

export default {
  name: "error",
  data() {
    return {
     isHeader:true
    };
  },
  created() {
    if(window.location.href.slice(0,5) == "http:"){
      this.isHeader = false
    }
  },
 
  methods: {
   
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.error{
  width:100%;
  height:100%;
  box-sizing:border-box;
  padding-top:100px;
  text-align: center;
  img{
    width:300px;
  }
  p{
    font-size:18px;
    margin-top:20px;
  }
}


</style>
