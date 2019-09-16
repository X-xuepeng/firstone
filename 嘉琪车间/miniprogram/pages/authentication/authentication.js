//index.js
const app = getApp()
Page({
  data: {
    canClick: false,
    color: '#00B26A',
  },

  onLoad: function () {

  },
  //登录
  login: function () {
    if (app.globalData.phone === undefined) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      })
      return;
    }
    if (app.globalData.code === undefined) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
        let that = this;
        //TODO 网络请求
        wx.showLoading({
          title: '验证身份',
          mask: true,
        });
        wx.request({
          method: 'post',
          url: 'https://workshopapi.gopas.com.cn/api/Login',
          data: {
            clearTextPasswords:true,
            userAccount: app.globalData.phone,
            userPassword: app.globalData.code,        
          },
          success: function (res) {
            console.log("sss"+JSON.stringify(res));
            //成功
            wx.hideLoading();
            if (res.data.Code === 200) {
              wx.showToast({
                title: '验证成功',
                icon: 'none'
              })
              //TODO 跳转下个界面
              wx.setStorageSync("access_token", res.data.Datas.access_token);
              wx.reLaunch({
                url: `../productline/productline`
              });
            }
          },
          fail: function (res) {
            //失败
            wx.hideLoading();
            wx.showLoading({
              title: '验证失败',
            });
          },
          complete: function () {
            //完成
          }
        })
      
    
  },
  phoneInput: function (e) {
    app.globalData.phone = e.detail.value;
  },
  codeInput: function (e) {
    app.globalData.code = e.detail.value;
  }
})