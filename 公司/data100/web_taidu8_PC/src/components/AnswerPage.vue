<template>
  <div class="answer">
    <com-header></com-header>
    <iframe :src="surveyUrl" frameborder="0" width="100%" height="99%"></iframe>
  </div>
</template>

<script>
import Login from "./common/Login";

export default {
  name: "answer",
  data() {
    return {
      surveyUrl: ""
    };
  },
  created() {
    var url = window.location.href;
    var urlArr = decodeURIComponent(url.split("answerpage/")[1]).split("state=")
    console.log()
    if (url.slice(0, 5) == "https") {
      window.location.href = "http" + url.slice(5, url.length);
    }else{
      localStorage.setItem("userInfo",urlArr[1])
    }
    this.surveyUrl = urlArr[0]
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.answer {
  width: 100%;
  height: 100%;
  padding-top: 80px;
  box-sizing: border-box;
}
</style>
