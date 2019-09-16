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
    console.log(openID)
    wx.showLoading({
      title: '解绑中',
      mask: true
    })
    wx.request({
      url: 'https://api.gopas.com.cn/api/WorkShop/UnBind',
      method: "get",
      data: {
        "openid": openID
      },
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.Code === 200) {
            wx.hideLoading();
            wx.setStorageSync('login', 'fail');
            wx.reLaunch({
              url: '../login/login'
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
  },
  //创建生产线
  createProduct(e){
    let access_token = wx.getStorageSync("access_token");
    console.log(access_token)
    if (access_token!==""){
      wx.navigateTo({ //跳转创建生产线
        url: '../productline/productline',
      })
    }else{
      wx.navigateTo({ //跳转身份验证
        url: '../authentication/authentication',
      })
    }
   
  }
})