<template>
  <div class='goods_list_box'>
    <div class="goods_list">
      <div class="goods" v-for="item in goodsList" :key="item.commodityId" @click="pushGoodsDetail(item)">
        <img :src="item.picture" alt="">
        <h4>{{ item.name }}</h4>
        <h5>{{ item.gold }}金币</h5>
        <h5 v-if='item.commodityType==="6"' style='text-decoration:line-through;color:rgba(153,153,153,1)'>市场价：{{item.price}}元</h5>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GoodsName',
  data(){
    return {
      type:this.$route.params.type
    }
  },
  computed: {
    goodsList () {
      return this.$store.getters.goodsList
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      const { dispatch } = this.$store
      dispatch('GetGoodsList', { type:this.type })
    },
    pushGoodsDetail (item) {
      const { commodityId } = item
      this.$router.push(`/goodsDetail/${commodityId}`)
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.goods_list_box{
  height: 100%;
  background: @white;
  overflow-y: auto;
  .goods_list{
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 40px;
    .goods{
      width: 50%;
      margin-top: 40px;
      padding: 0 15px;
      text-align: center;
      img{
        width: 100%;
        height: 204px;
        display: block;
        border-radius: 20px;
        object-fit: cover;
      }
      h4{
        font-size: 30px;
        color: @title-gray1;
        margin: 30px 0 20px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      h5{
        font-size: 26px;
        color: #ed5757;
      }
    }
  }
}
</style>