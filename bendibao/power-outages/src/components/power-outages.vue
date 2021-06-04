<template>
  <div class="page">
    <div class="header">
      <img
        src="../assets/停水、停电、停气切图(1)/停水、停电、停气切图/1.停水查询.jpg"
        alt=""
      />
      <div class="option">
        <!-- <input type="text" class="input" />
        <ul>
          <li>1</li>
          <li>1</li>
        </ul> -->
        <!-- <select name="" id="" class="input">
          <option value="">1</option>
                    <option value="">1</option>
        </select> -->

        <div class="divInput">
          <div class="input" @click="openValue">
            <span>{{ value }}</span>
            <img
              src="../assets/箭头 (4).png"
              alt=""
              :class="{ 'img-rotate': rotate }"
            />
            <!-- <input v-model="value" type="text" placeholder="杭州" /> -->
            <!-- <img src="../assets/arrow.png" alt="" /> -->
          </div>
          <div v-bind:class="{ 'list-show': show, 'list-hidden': !show }">
            <ul>
              <li
                @click="getvalue(index, item)"
                v-for="(item, index) in tableData"
                :key="item.index"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="search">
        <input type="text" placeholder="请输入停电范围关键字查询" />
        <button>查询</button>
      </div>
      <div class="info">
        <div class="info-detail" v-for="(v, i) in info" :key="i">
          <div class="info-detail-page">
            <div class="icon">
              <img
                src="../assets/停水、停电、停气切图(1)/停水、停电、停气切图/00.png"
                alt=""
                class="icon-img"
              />
              <div>{{ v[0] }}</div>
              <img
                src="../assets/停水、停电、停气切图(1)/停水、停电、停气切图/01.png"
                alt=""
                class="icon-img"
              />
              <div>
                <div v-bind:class="text" ref="more" class="text">
                  {{ v[1] }}
                </div>
              </div>
              <div style="width: 100%; text-align: center">
                <img
                  src="../assets/箭头 (3).png"
                  alt=""
                  @click="more(i)"
                  :status="i"
                  ref="status"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div>
          分享<img src="../assets/分 享.png" alt="" class="icon-share" />
        </div>
        <div>返回杭州本地宝首页</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: ["Foo", "Bar", "Fizz", "Buzz"],
    info: [
      [
        "停电时间 : 11月20日 09:00至11月20日 17:30",
        "停电范围 : 浙江省-杭州市(萧山区-义蓬街道-春雷行 政村-春雷自然村,钱塘新区-义蓬街道-春雷行自然...停电范围 : 浙江省-杭州市(萧山区-义蓬街道-春雷行 政村-春雷自然村,钱塘新区-义蓬街道-春雷行自然...",
      ],
      [
        "停电时间 : 11月20日 09:00至11月20日 17:30",
        "停电范围 : 浙江省-杭州市(萧山区-义蓬街道-春雷行 政村-春雷自然村,钱塘新区-义蓬街道-春雷行自然...111111111",
      ],
      [
        "停电时间 : 11月20日 09:00至11月20日 17:30",
        "停电范围 : 浙江省-杭州市(萧山区-义蓬街道-春雷行 政村-春雷自然村,钱塘新区-义蓬街道-春雷行自然...",
      ],
      [
        "停电时间 : 11月20日 09:00至11月20日 17:30",
        "停电范围 : 浙江省-杭州市(萧山区-义蓬街道-春雷行 政村-春雷自然村,钱塘新区-义蓬街道-春雷行自然...",
      ],
    ],
    text: "text-1",
    tableData: [
      {
        name: "成都",
      },
      {
        name: "北京",
      },
      {
        name: "上海",
      },
    ],
    show: false,
    value: "杭州",
    rotate: false,
  }),
  methods: {
    more(i) {
      if (this.$refs.more[i].style.height == "auto") {
        this.$refs.more[i].style.height = "0.7rem";
      } else {
        this.$refs.more[i].style.height = "auto";
      }
    },
    openValue() {
      if (!this.rotate) {
        this.rotate = true;
      } else this.rotate = false;

      this.show = !this.show;
    },
    getvalue(index, item) {
      if (!this.rotate) {
        this.rotate = true;
      } else this.rotate = false;
      this.value = item.name;
      this.show = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style src="../common/normalize.css"></style>
<style scoped src="../css/power.css"></style>
