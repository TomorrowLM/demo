<template>
    <div class="error">
        <div class="detail">
            <div class="img"><img src="../../assets/images/common/rewardError.png" alt="" srcset=""></div>
            <div class="p">{{errorMsg}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: "RewardError",
    data() {
        return {
            errorMsg: '',
        };
    },
    mounted(){
        document.getElementsByTagName("html")[0].style.maxWidth = "100%"
        let query = this.$route.query;
        if (query.msg) {
            this.errorMsg = query.msg
        } 
        // let url = window.location.search.replace(/\?/g,'').replace(/\=/g,'');
        // this.errorMsg = decodeURIComponent(url).split('&')[1].split('=')[1];
    },
    beforeDestroy(){
        document.getElementsByTagName("html")[0].style.maxWidth = "500px"
    },
    methods: {},
};
</script>
<style lang="scss" scoped>
@media only screen and (min-width: 500px) {
    .error{
        background: url("../../assets/images/common/background.png") no-repeat top, -webkit-linear-gradient(0deg,#C7A2EE 0%,#6B6BD3 100%);
        width: 100%;
        height: 100%;
        margin: 0 auto;
        padding-top: 112px;
        position: relative;
    }
    .detail{
        background: url("../../assets/images/common/bg4.png") no-repeat top,-webkit-linear-gradient(270deg,#ffffff 100%,#f3f2ff 100%);
        width: 1000px;
        height: 510px;
        margin: 0 auto;
        border-radius: 20px;
        box-shadow: 0px 5px 15px 0px rgba(40,0,161,0.10);
        padding-top: 120px;
        .span{
            width: 460px;
            height: 48px;
            opacity: 1;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #909399;
            line-height: 24px;
            margin:  0 auto;
        }
        .p{
            margin: 50px auto;
            height: 25px;
            opacity: 1;
            font-size: 30px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #303133;
            line-height: 25px;
        }
    }
}
@media only screen and (max-width: 450px) {
    .error{
        background: #ffffff;
        height: 100%;
        margin: auto;
        position: relative;
    }
    .detail{
        // ,-webkit-linear-gradient(270deg,#ffffff 100%,#f3f2ff 100%);
        
        background: url("../../assets/images/common/bg4.png") no-repeat top;
        background-size: cover;
        width: 100%;
        margin: 0 auto;
        padding-top: 120px;
        position: fixed;
        .span{
            width: 305px;
            height: 72px;
            opacity: 1;
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: justify;
            color: #909399;
            line-height: 24px;
            margin:  0 auto;
        }
        .p{
            margin: 20px auto;
            height: 25px;
            opacity: 1;
            font-size: 30px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #303133;
            line-height: 165px;
        }
    }
}
.img{
    width: 200px;
    margin: 0 auto;
}

</style>