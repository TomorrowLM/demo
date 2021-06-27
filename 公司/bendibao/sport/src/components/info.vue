<template>
  <div class="page">
    <div class="info">
      <div class="icon">
        <div class="o-u"><span>实时资讯</span></div>
        <div class="ou-1"></div>
      </div>
      <div class="info-detail">
        <div class="info-show" v-for="(val, i) in info" :key="i">
          <div class="row-1">
            <img src="../static/b75fbf1a-50b4-4dc1-83ab-8ee039afe1e2.png" alt="" class="icon-1">
            {{ val.time }}</div>
          <div class="row-2">
            <div>美国新冠肺炎超3025万例</div>
            <div>
              美国约翰斯·霍普金斯大学的统计数据显示，截至美东时间3月28日16时26分，美国新冠肺炎累计确诊病例达30255303例，累计死亡病例达549288例。
            </div>
            <div>来源:央视新闻</div>
          </div>
        </div>
      </div>
      <div class="showMore">
        <div @click="loadMore" class="more" v-if="loading">查看更多</div>
        <div class="more" v-if="finished">没有更多了</div>
      </div>
    </div>
  </div>
</template>

<script>
import "./../common/rem.js";

export default {
  data: function () {
    return {
      info: [
        {
          time: "2021年03月29日 06:21",
          title: "美国新冠肺炎超3025万例",
          information:
            "美国约翰斯·霍普金斯大学的统计数据显示，截至美东时间3月28日16时26分，美国新冠肺炎累计确诊病例达30255303例，累计死亡病例达549288例。",
          source: "来源:央视新闻",
        },
        {
          time: "2021年03月29日 06:21",
          title: "美国新冠肺炎超3025万例",
          information:
            "美国约翰斯·霍普金斯大学的统计数据显示，截至美东时间3月28日16时26分，美国新冠肺炎累计确诊病例达30255303例，累计死亡病例达549288例。",
          source: "来源:央视新闻",
        },
        {
          time: "2021年03月29日 06:21",
          title: "美国新冠肺炎超3025万例",
          information:
            "美国约翰斯·霍普金斯大学的统计数据显示，截至美东时间3月28日16时26分，美国新冠肺炎累计确诊病例达30255303例，累计死亡病例达549288例。",
          source: "来源:央视新闻",
        },
      ],
      loading: true,
      finished: false,
    };
  },
  components: {},
  beforeMount() {},
  methods: {
    loadMore() {
      this.info.push(this.info[0]);
      this.loading = false;
      this.finished = true;
    },
  },
};
</script>

;
