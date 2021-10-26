<template>
  <div class="empty">
    <img src="../../../static/images/img_empty_noque.png" alt="">
    <p>{{msg}}</p>
    <p>{{msg2}}</p>
  </div>  
</template>
<script>
export default {
  name: "empty",
  props:{
    msg:{
      type:String,
      default:"暂无问卷，待会儿再来看看吧"
    },
    msg2:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      
    };
  },
  
};
</script>
<style lang="scss" scoped>
  .empty{
    padding:30px 0;
    text-align: center;
    color:#999;
    font-size:14px;
    p{
      margin-top:10px;
    }
    img{
      width:300px;
    }

  }
</style>