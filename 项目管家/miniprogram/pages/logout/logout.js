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
  //退出登录,接口没做
  logout(e) {
    let openID = wx.getStorageSync("openId");
    let phoneNumber = wx.getStorageSync("phoneNumber");
    wx.showLoading({
      title: '解绑中',
      mask: true
    })
    console.log(openID);
    console.log(phoneNumber)
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Login/Unbind',
      method: "POST",
      data: {
        "phone": phoneNumber,
        "userId": openID
      },
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            wx.hideLoading();
            wx.setStorageSync('login', 'fail');
            wx.reLaunch({
              url: '../login/login'
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '解绑失败' + JSON.stringify(res.data.message),
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
      },
      fail(error) { }
    })
  }
})