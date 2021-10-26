<template>
  <div>
    <div v-if="isTickets" class="tickets"></div>
    <div class="tickets_list" :style="{bottom:isTickets?'0':'-860px'}" @click.stop>
      <div class="title">选择卡券</div>
      <ul class="lists">
        <li :class="{ 'dis': !item.available }" v-for="(item,index) in ticketLists" :key="index" @click="useTicket(index, item.available)">
          <div class="ticket_num">
            <h3>{{item.discount}}</h3>
            <div class="selected" v-if="item.isUsed">
              <img src="../../assets/images/survey/my_coupon_btn_icsel.png" alt />
            </div>
            <div class="sel" v-else-if="!item.available">不可用</div>
            <div class="sel" v-else>选择</div>
          </div>
          <div class="ticket_border"></div>
          <div class="ticket_desc">
            <div>{{item.cardName}}</div>
            <div v-for="(tip,tip_index) in item.descStr.split('\n')" :key="tip_index">{{tip}}</div>
          </div>
        </li>
      </ul>
      <div class="box_padding">
        <div class="common_btn" @click="submitTicket">{{ availableNum === 0 ? '返回' : '确认' }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { surveyCard } from "@/api/survey";
import { Toast } from 'vant'
export default {
  name: "tickets_list",
  props: {
    isTickets: {
      type: Boolean,
      required: true
    },
    ticketLists: {
      type: Array,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    surveyId: {
      type: String,
      required: true
    },
    finalGold: {
      type: String,
      required: true,
      default: '0'
    },
    availableNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cardId: ""
    };
  },
  methods: {
    useTicket(index, available) {
      if (available) {
        var list = this.ticketLists;
        for (var i = 0; i < list.length; i++) {
          if (list[i].isUsed && i == index) {
            list[i].isUsed = false;
            this.cardId = "";
            this.ticketLists = list;
            return;
          } else if (list[i].isUsed) {
            list[i].isUsed = false;
          }
        }
        console.log(index);
        list[index].isUsed = true;
        this.cardId = this.ticketLists[index].cardId;
        this.ticketLists = list;
      }
    },
    submitTicket() {
      var that = this;
      if (this.availableNum > 0) {
        if (this.cardId === "") {
          Toast("请选择卡券");
          return;
        }
        surveyCard({
          userId: that.userId,
          cardId: that.cardId,
          surveyId: that.surveyId
        }).then(data => {
          if (data.data.status == 1) {
            this.$parent.hideTicketlist();
            this.$parent.isHaveTickets();
          } else {
            Toast(data.data.cardName);
          }
        });
      } else {
        this.$parent.hideTicketlist();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tickets {
  cursor: pointer;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.6);
}
.tickets_list {
  cursor: auto;
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  max-width: 500PX;
  height: 80%;
  // margin: auto auto;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  transition: bottom 0.4s;
  z-index: 100;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 30px;
    color: #333;
    border-bottom: @PX solid #ddd;
    line-height: 108px;
    text-align: center;
  }
  .lists {
    width: 100%;
    box-sizing: border-box;
    padding: 60px 30px 0;
    overflow-y: auto;
    flex: 1 0;
    .dis{
      border: @PX dotted #999;
      color: #999;
      background: #f5f5f5;
      &::before, &::after{
        border-color: #999;
      }
      .ticket_border, .sel{
        border-color: #999;
      }
      .ticket_desc{
        div{
          color: #999;
          &::before{
            background: #999;
          }
        }
      }
    }
  }
  .lists li {
    cursor: pointer;
    width: 100%;
    border: @PX dotted #ffbc9e;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 24px 20px;
    background: #ffece6;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #ff5000;
    margin-bottom: 24px;
  }
  .lists li:before {
    content: "";
    position: absolute;
    top: -@PX;
    left: 210px;
    background: #fff;
    width: 20px;
    height: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border: @PX dotted #ffbc9e;
    border-top: none;
  }
  .lists li:after {
    content: "";
    position: absolute;
    bottom: -@PX;
    left: 210px;
    background: #fff;
    width: 20px;
    height: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: @PX dotted #ffbc9e;
    border-bottom: none;
  }
  .ticket_num {
    width: 178px;
    height: 154px;
    text-align: center;
  }
  .ticket_num h3 {
    font-size: 44px;
    margin: 6px 0 20px;
    font-family: PingFangSC-Medium;
  }
  .ticket_num .sel {
    margin: 0 auto;
    width: 140px;
    height: 56px;
    line-height: 56px;
    text-align: center;
    border: @PX solid #ff5000;
    border-radius: 30px;
    font-size: 26px;
  }
  .ticket_num .selected {
    margin: 0 auto;
    width: 140px;
    height: 56px;
    line-height: 50px;
    text-align: center;
    background: #ff5000;
    border-radius: 28px;
  }
  .ticket_num .selected img {
    width: 36px;
    height: 24px;
    vertical-align: middle;
  }
  .ticket_border {
    position: absolute;
    bottom: 8px;
    top: 8px;
    left: 220px;
    border-left: @PX dotted #ffbc9e;
  }
  .ticket_desc {
    flex: 1;
    box-sizing: border-box;
    padding-left: 50px;
  }
  .ticket_desc div {
    color: #ff7739;
    font-size: 20px;
    line-height: 30px;
    text-align: left;
  }
  .ticket_desc div:nth-child(1) {
    font-size: 26px;
    color: #ff5000;
    margin-bottom: 8px;
  }
  .ticket_desc div:not(:first-child) {
    box-sizing: border-box;
    padding-left: 20px;
    position: relative;
  }
  .ticket_desc div:not(:first-child):before {
    position: absolute;
    top: 14px;
    left: 0;
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ff7739;
  }
  .box_padding {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30px;
    margin-top: 30px;
  }
  .common_btn {
    cursor: pointer;
    width: 100%;
    height: 90px;
    line-height: 90px;
    font-size: 32px;
    color: #fff;
    background: #7575f9;
    border-radius: 45px;
    text-align: center;
  }
}
</style>