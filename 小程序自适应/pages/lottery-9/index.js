// pages/lottery-9/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:''
  },

  inputId(e){
    this.setData({
      id: e.detail.value
    })
    console.log(this.data.id)
  },

  getIdInfo(){
    let that = this
    console.log(that.data.id)
    wx.request({
      url: "http://szapi.bendibao.com/smartprogram/sub_message.php",
      data: {
        action: 'search',
        city: "深圳",
        code: that.data.id,
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success (res) {
        console.log(res.data)
        let msg = res.data
        if(msg.message=='未中签'){
          wx.redirectTo({
            url: '../lottery-17/index'
          })
        }else{
          wx.redirectTo({
            url: '../lottery-18/index'
          })
        }
      },
    })
  },
})