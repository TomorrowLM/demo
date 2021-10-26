<template>
  <div class="detail">
    <div class="img img_fail">
      <img src="https://www.taidu8.com/survey_data100/common_images/project_queend_img2@2x.png" alt />
    </div>
    <div class="dis">
      <p>{{msg}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'surveydata',
  data() {
    return {
      msg: ""
    };
  },
  created() {
    if (this.$route.query.msg) {
      this.msg = this.$route.query.msg
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail {
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    box-sizing: border-box;
    padding-top: 150px;

    .img {
      width: 200px;
      height: 200px;
      text-align: center;
      line-height: 200px;
      background: #7575f9;
      border-radius: 50%;
      margin: 0 auto;
      box-sizing: border-box;
      padding-top: 20px;
      img {
        width:100px;
      }
    }
    .img_fail.img {
      padding-top: 10px;
      img {
        width: 180px;
      }
    }
    .dis {
      margin: 90px auto;
      text-align: center;
      p {
        max-width: 560px;
        margin: 0 auto;
        &:nth-child(1) {
          font-size: 30px;
          color: #333;
        }
        &:nth-child(2) {
          margin-top: 40px;
          font-size: 32px;
          color: #333;
        }
      }
    }
  }
</style>