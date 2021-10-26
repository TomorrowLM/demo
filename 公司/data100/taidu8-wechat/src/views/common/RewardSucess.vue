<template>
    <div class="sucess">
        <div class="detail">
            <div class="img"><img src="../../assets/images/common/rewardSucess.png" alt="" srcset=""></div>
            <div class="p">
                <p class="text">恭喜您</p>
                <p class="text">获取<span class="red" v-if="sucessMsg">{{sucessMsg}}元</span>红包</p>
            </div>
            <p class="span">红包会在5分钟左右发送到您的微信账户(如遇到微信异常，可能会延时)，请收到后<span class="red">立即拆开红包以免红包过期被退回</span>。</p>
        </div>
        <!--<div class="logo_box">
            <div class="logo"></div>
        </div>-->
    </div>
</template>
<script>
export default {
    name: "RewardSucess",
    data() {
        return {
            sucessMsg: ''
        };
    },
    mounted(){
        document.getElementsByTagName("html")[0].style.maxWidth = "100%"
        let query = this.$route.query
        if (query.msg) {
            this.sucessMsg = query.msg
        } 
        // let url = window.location.search.replace(/\?/g,'').replace(/\=/g,'');
        // this.sucessMsg = decodeURIComponent(url).split('&')[1].split('=')[1];
    },
    beforeDestroy(){
        document.getElementsByTagName("html")[0].style.maxWidth = "500px"
    },
    methods: {},
};
</script>
<style lang="scss" scoped>
@media only screen and (min-width: 500px) {
    .sucess{
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
        height: 520px;
        margin: 0 auto;
        border-radius: 20px;
        box-shadow: 0px 5px 15px 0px rgba(40,0,161,0.10);
        padding-top: 110px;
        .span{
            width: 460px;
            height: 48px;
            opacity: 1;
            font-size: 22px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #909399;
            line-height: 30px;
            margin:  0 auto;
        }
        .text{
            display: inline-block;
            opacity: 1;
            font-size: 32px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #303133;
            margin: 0 auto;
            margin-top: 30px;
        }
    }
}
@media only screen and (max-width: 450px) {
    .sucess{
        background: #ffffff;
        height: 100%;
        margin: auto;
        position: relative;
    }
    .detail{
        background: url("../../assets/images/common/bg4.png") no-repeat top,-webkit-linear-gradient(270deg,#ffffff 100%,#f3f2ff 100%);
        width: 100%;
        margin: 0 auto;
        padding-top: 215px;
        position: fixed;
        .span{
            width:560px;
            height: 72px;
            opacity: 1;
            font-size: 22px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: justify;
            color: #909399;
            line-height: 32px;
            margin:  0 auto;
        }
        .text{
            height: 30px;
            height: 40px;
            opacity: 1;
            font-size: 30px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #303133;
        }
    }
    div.p{
        margin: 50px auto 40px;
        text-align: center;
    }
}

.red{
    color: red;
}
.img{
    width: 210px;
    // height: 140px;
    // background: url("../../assets/images/common/rewardSucess.png") no-repeat center;
    margin: 0 auto;
}
.p{
    margin: 20px auto;
    text-align: center;
}
// .logo_box{
//     width: 236px;
//     height: 52px;
//     opacity: 0.8;
//     background: #f1f0fb;
//     border-radius: 0px 0px 20px 20px;
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     margin: 0 auto;
//     .logo{
//         width: 160px;
//         height: 28px;
//         background: url("../../static/images/cem_logo.png") no-repeat center;
//         margin: 12px auto;
//     }
// }
</style>
