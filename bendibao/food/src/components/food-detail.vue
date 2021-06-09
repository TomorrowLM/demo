<template>
  <div>
    <div class="page">
      <div class="header">
        <div class="title">Title</div>
        <div class="share">
          <img src="../assets/Icon-Line-Eat.png" alt="" />
        </div>
      </div>
      <div class="img-detail">
        <img src="../assets/Image_1.png" alt="" />
      </div>
      <div class="detail-list">
        <div>
          <img src="../assets/Oval 4.png" alt="" />
          <div>
            <div>Amy Vasquez</div>
            <div>45 Reviews, 210 Followers</div>
          </div>
        </div>
        <div class="like">
          <span>158</span>
          <img src="../assets/Icon-Next_1.png" alt="" />
        </div>
      </div>
    </div>
    <hr />
    <div class="page-1">
      <div class="food-title">
        <div>Microwave Cooking Is The Wave Of The Future</div>
        <div class="level">
          <div>
            <img
              src="../assets/shape-star.png"
              alt=""
              v-for="(v, index) in 5"
              :key="index"
            />
          </div>
          <div>4.8</div>
          <div>(194 Reviews)</div>
        </div>
      </div>
      <div class="price">$158</div>
    </div>
    <div class="table">
      <table>
        <tr>
          <td width="105">
            <div>24</div>
            <div>Service</div>
          </td>
          <td width="181">
            <div>15min</div>
            <div>Time</div>
          </td>
          <td width="112">
            <div>24</div>
            <div>Category</div>
          </td>
        </tr>
      </table>
    </div>
    <div class="present">Present</div>
    <div class="present-detail">
      You may be a person who loves to cook. You absolutely love to spend time
      in your kitchen. As a result, you like to outfit your kitchen with the
      latest and with the best cookware that is available on the market.
      However, and with that said, if you are like most people in the 21st
      century, you also live your life on a budget. You simply do not have a
      great deal of extra money to blow and spend at will. Therefore, with the
      goal of outfitting your kitchen with the latest, with the best in
      cookware, you also want to keep your eyes on ways in which you can save
      money on your cookware purchases. To this end, you might want to focus
      your attention on the Internet and the World Wide Web, specifically on
      overstock merchandise sites that are springing up all over the Net. There
      are many benefits that can be realized by shopping for cookware at
      overstock sites on the Net. First and foremost is price. In the vast
      majority of instances, you will be able to find up to date cookware for
      sale at these overstock websites for prices far less than what you will be
      able to find otherwise at different retail venues in either the brick and
      mortar world or on the World Wide Web. One of the other, important
      benefits to be realize by shopping for cookware for your home at overstock
      sites is found in the fact that they are very convenient. A consumer such
      as you literally can shop for cookware twenty four hours a day and seven
      days a week. If you are like most people in this day and age, not only are
      you living on a tight budget, but you are living on a tight schedule as
      well. You simply do not have the time available to you to shop around, to
      spend a great deal of time going from store to store, looking for cookware
      for your home. Thus, an Internet based overstock site can be a true
      godsend when it comes to saving time in your search for the best cookware
      for your own kitchen. As a final reminder, make certain that you only
      patronize those overstock sites that have established reputations for
      reliability. By shopping at an established site, you will make certain
      that you do obtain exactly the cookware products that you have bargained
      for while visiting one of the overstock venues on the Net.
    </div>
    <div class="order-button">Oder now</div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {};
  },
  components: {},
  props: {},
  methods: {},
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./../css/food-detail.css"></style>
