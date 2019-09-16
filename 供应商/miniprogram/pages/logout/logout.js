// miniprogram/pages/logout/logout.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //退出登录
  logout(e) {
    let openID = wx.getStorageSync("openId");
    wx.showLoading({
      title: '解绑中',
      mask: true
    })
    wx.request({
      url: `https://dingtalk.microfeel.net:12401/api/WeChat/Untie`,
      method: "get",
      data: {
        Openid: openID 
      },
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.result === 0) {
            wx.hideLoading();
            wx.setStorageSync('login', 'fail');
            wx.reLaunch({
              url: '../index/index'
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '解绑失败' + JSON.stringify(res),
              icon: 'none'
            })
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '解绑失败' + JSON.stringify(res),
            icon: 'none'
          })
        }
      }
    })
  }
})