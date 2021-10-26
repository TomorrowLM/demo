<template>
  <div class="survey_one">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <empty tips="问卷马上袭来，先去【问英雄】看看吧" v-if="isEmpty===1"></empty>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-else>
        <van-cell class="survey_one_van_cell" v-for="(item,index) in list" :key="index">
          <survey :item="item" @showPc="showPc"></survey>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop> 
        <div class="block">
          <div class="bg">
            <img src="../../assets/images/survey/que_pop_pcimg.png" alt srcset />
            <div class="tip">电脑答题，红包更大</div>
            <div class="tips">
             此问卷只能在电脑端参与：电脑端搜索【拼任务】，或输入网址：
              <span>www.pinrenwu.cn</span>，登录后即可参与。
            </div>
          </div>

           <van-button class="btn" @click="show = false"
            v-clipboard:copy="'www.pinrenwu.cn'" 
            v-clipboard:success="onCopy" 
            v-clipboard:error="onCopyError"
          >复制网址</van-button>
        </div>
        <img  @click="closeTips" src="../../assets/images/my_pop_btn_close.png" alt srcset />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import Survey from "./Survey";
import { mixin } from "@/utils/mixin/list";
import { partition_survey } from "@/api/survey.js";
import { Toast } from 'vant'
export default {
  components: {
    Survey
  },
  mixins: [mixin],
  data() {
    return {
      show: false,
    };
  },
  methods: {
    onCopy () {
      Toast.success('已复制')
    },
    onCopyError () {
      Toast.fail('复制失败')
    },
    showPc() {
      this.show = true;
    },
    closeTips(){
      this.show = false;
    },
    getList() {
      return partition_survey({
        page: this.page, //init
        limit: this.limit,//init
        surveyChannelCode: 0, //二区问卷的渠道码 init
        type: 0 //0:一区问卷、1：二区问卷列表 2：pc问卷列表 3：历史问卷（上拉加载） init
      });
    }
  }
};
</script>

<style lang='less' scoped>
//@import url()
.survey_one {
  height: 100%;
  .survey_one_van_cell{
    padding: 0;
    /deep/ .van-cell__value{
      padding: 10px 16px;
    }
  }
  .survey_mask{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .van-pull-refresh {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .van-overlay {
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wrapper {
    width: 560px;

    .block {
      border-radius: 40px;
      overflow: hidden;
      .bg {
        background: linear-gradient(#ae81fd, #6d75ff);
        box-sizing: border-box;
        padding: 50px;
      }
      img {
        display: block;
        width: 458px;
        height: auto;
      }
      .tip {
        font-size: 32px;
        color: #ffeb9d;
        margin: 40px 0;
        text-align: center;
      }
      .tips {
        color: #fff;
        font-size: 26px;
        span {
          color: #ffeb9d;
        }
      }
      .btn {
        width: 100%;
        background: #fff;
        font-size: 32px;
        color: #7679f5;
        text-align: center;
        height:110px;
        line-height:110px;
      }
    }

    img {
      display: block;
      width: 48px;
      height: auto;
      margin: 50px auto 0;
    }
  }
}
</style>