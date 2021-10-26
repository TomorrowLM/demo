<template>
  <div class="tickets">
    <div class="tickets_list" @click.stop>
      <div class="title">选择卡券</div>
      <ul class="lists">
        <li :class="{ 'dis': finalGold < 100 && item.type !== 4 }" v-for="(item,index) in ticketLists" :key="index" @click="useTicket(index, finalGold < 100 && item.type !== 4)">
          <div class="ticket_num">
            <h3>{{item.discount}}</h3>
            <div class="selected" v-if="item.isUsed">
              <img src="../../assets/my_coupon_btn_icsel.png" alt />
            </div>
            <div class="sel" v-else-if="finalGold < 100 && item.type !== 4">不可用</div>
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
        <div class="common_btn" @click="submitTicket">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "../../api/common";
export default {
  name: "tickets_list",
  props: {
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
    }
  },
  data() {
    return {
      cardId: ""
    };
  },
  methods: {
    useTicket(index, disabled) {
      if (!disabled) {
        var list = this.ticketLists;
        for (var i = 0; i < list.length; i++) {
          if (list[i].isUsed) {
            list[i].isUsed = false;
            if (i == index) {
              this.cardId = "";
              this.ticketLists = list;
              return;
            }
          }
        }
        this.cardId = this.ticketLists[index].cardId;
        this.ticketLists[index].isUsed = true;
      }
    },
    submitTicket() {
      var that = this;
      if (this.cardId === "") {
        $toast.show("请选择卡券");
        return;
      }
      common.surveyCard(this.userId, this.cardId, this.surveyId).then(data => {
        if (data.data.status == 1) {
          this.$parent.hideTicketlist();
          this.$parent.isHaveTickets();
        } else {
          $toast.show(data.data.cardName);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tickets {
  cursor: pointer;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.tickets_list {
  cursor: auto;
  position: absolute;
  top: 20px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  width: 375px;
  height: 470px;
  margin: auto auto;
  border-radius: 25px;
  transition: 0.4s;
  z-index: 100;
  box-sizing: border-box;

  .title {
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #ddd;
    line-height: 54px;
    text-align: center;
  }
  .lists {
    width: 100%;
    box-sizing: border-box;
    padding: 30px 15px 0;
    overflow-y: auto;
    height: 340px;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #7575f9;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ededed;
    }
    .dis{
      border: 1PX dotted #999;
      color: #999;
      background: #f5f5f5;
      cursor: inherit;
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
    border: 1px dotted #ffbc9e;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 12px 10px;
    background: #ffece6;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #ff5000;
    margin-bottom: 12px;
  }
  .lists li:before {
    content: "";
    position: absolute;
    top: -1px;
    left: 105px;
    background: #fff;
    width: 10px;
    height: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px dotted #ffbc9e;
    border-top:none;
  }
  .lists li:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 105px;
    background: #fff;
    width: 10px;
    height: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px dotted #ffbc9e;
    border-bottom:none;
  }
  .ticket_num {
    width: 89px;
    height: 77px;
    text-align: center;
  }
  .ticket_num h3 {
    font-size: 22px;
    margin: 3px 0 10px;
  }
  .ticket_num .sel {
    margin: 0 auto;
    width: 70px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #ff5000;
    border-radius: 15px;
    font-size: 13px;
  }
  .ticket_num .selected {
    margin: 0 auto;
    width: 70px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #ff5000;
    border-radius: 15px;
  }
  .ticket_num .selected img {
    width: 18px;
    height: 12px;
  }
  .ticket_border {
    position: absolute;
    bottom: 4px;
    top: 4px;
    left: 110px;
    border-left: 1px dotted #ffbc9e;
  }
  .ticket_desc {
    flex: 1;
    box-sizing: border-box;
    padding-left: 25px;
  }
  .ticket_desc div {
    color: #ff7739;
    font-size: 10px;
    line-height: 15px;
    text-align: left;
  }
  .ticket_desc div:nth-child(1) {
    font-size: 13px;
    color: #ff5000;
    margin-bottom: 4px;
  }
  .ticket_desc div:not(:first-child) {
    box-sizing: border-box;
    padding-left: 10px;
    position: relative;
  }
  .ticket_desc div:not(:first-child):before {
    position: absolute;
    top: 7px;
    left: 0;
    content: "";
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #ff7739;
  }
  .box_padding {
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    margin-top: 15px;
  }
  .common_btn {
    cursor: pointer;
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: #fff;
    background: #7575f9;
    border-radius: 22px;
    text-align: center;
  }
}
</style>