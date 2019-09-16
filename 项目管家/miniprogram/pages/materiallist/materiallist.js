// miniprogram/pages/materiallist/materiallist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      materiallist:[],
      isNull: false,
      isError: false,
      openId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.openId=options.openId;
    let that = this;
    wx.showLoading({
      title: '获取主材确认单',
    });
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Supervisor/bills',
      data: {
        'openid': this.data.openId
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            if (res.data.bills.length === 0) {
              that.setData({
                isNull: true
              })
            } else {
              for (let bill of res.data.bills){
                if (bill.supStatus===5){
                  bill.image="all";
                  bill.status="全部送达"
                  bill.color ="#3c763d"
                }else{
                  bill.image = "no_all";
                  bill.status = "未全送达"
                  bill.color = "#a94442"
                }
              }
              that.setData({
                materiallist: res.data.bills
              })
            }
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: JSON.stringify(res.data.message),
              icon: 'none'
            })
            that.setData({
              isError: true
            })
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: JSON.stringify(res),
            icon: 'none'
          })
          that.setData({
            isError: true
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  material_detail(e){
    let material=this.data.materiallist.find(function(material){
      return material.id === e.currentTarget.id
    });
    wx.navigateTo({
      url: `../materialDetail/materialDetail?ID=${e.currentTarget.id}&address=${material.address}`
    });
  }
})