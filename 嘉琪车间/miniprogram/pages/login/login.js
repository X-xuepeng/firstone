//index.js
const app = getApp()
Page({
  data: {
    canClick: false,
    codeText: '获取验证码',
    color: '#00B26A',
  },

  onLoad: function () {
    let login = wx.getStorageSync('login');
    let openId=wx.getStorageSync('openId');
    let phoneNumber=wx.getStorageSync('phoneNumber');
    if (login === 'success') {
      wx.reLaunch({
        url: `../projectlist/projectlist?openId=${openId}`
      });
    } else {
      let that=this;
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          this.data.openId = res.result.openid
          wx.request({
            url: 'https://api.gopas.com.cn/api/WorkShop/Exist',
            data: {
              openid: res.result.openid
            },
            success: function (res) {
              if (res.statusCode === 200) {
                if (res.data.code === 200) {
                  wx.setStorageSync('login', 'success');
                  wx.setStorageSync('openId', that.data.openId);
                  wx.reLaunch({
                    url: `../projectlist/projectlist?openId=${that.data.openId}`
                  });
                }
              }

            },
            fail: function (res) {

            }
          })

        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
  },
  //获取验证码
  sendCode: function () {
    if (this.data.canClick) {
      return;
    }
    if (app.globalData.phone === undefined) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    } else {
      var obj = this;
      if (app.globalData.phone.length !== 11) {
        wx.showToast({
          title: '请输入正确手机号码格式',
          icon: 'none'
        })
        return
      } else {
        //TODO 网络请求
        wx.showLoading({
          title: '发送验证码',
          mask: true,
        });
        wx.request({
          url: 'https://api.gopas.com.cn/api/WorkShop/SendVerificationCode',
          data: { 
            phonecode: app.globalData.phone,
            openid:obj.data.openId
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.Code !== 200) {
              wx.showToast({
                title: JSON.stringify(res),
                icon: 'none'
              })
              return;
            }
            wx.showToast({
              title: '发送验证码成功',
              icon: 'none'
            })
            let value = 60;
            //倒计时验证码
            let timer = setInterval(() => {
              value--;
              if (value === 0) {
                obj.setData({
                  canClick: false,
                  codeText: '获取验证码',
                  color: '#00B26A'
                });
                clearInterval(timer)
              } else {
                obj.setData({
                  canClick: true,
                  codeText: '剩余' + value + '秒',
                  color: '#333'
                });
              }
            }, 1000);
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '发送验证码失败' + JSON.stringify(res),
              icon: 'none'
            })
          },
          complete: function () { }
        })
      }
    }
  },
  //登录
  login: function () {
    if (app.globalData.code === undefined) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    } else {
      if (app.globalData.code.length !== 4) {
        wx.showToast({
          title: '请输入正确验证码',
          icon: 'none'
        })
        return;
      } else {
        let that=this;
        //TODO 网络请求
        wx.showLoading({
          title: '登录',
          mask: true,
        });
        wx.request({
          method: 'get',
          url: 'https://api.gopas.com.cn/api/WorkShop/CheckVerificationCode',
          data: {
            phonecode: app.globalData.phone,
            verifycode: app.globalData.code,
            openid: that.data.openId
          },
          success: function (res) {
            console.log(JSON.stringify(res));
            //成功
            wx.hideLoading();
            if (res.data.Code === 200) {
              wx.showToast({
                title: '登陆成功',
                icon: 'none'
              })
              //TODO 跳转下个界面
              wx.setStorageSync('login', 'success');
              wx.setStorageSync('openId', that.data.openId)
              wx.reLaunch({
                url: `../projectlist/projectlist?openId=${that.data.openId}`
              });
            }
          },
          fail: function (res) {

            //失败
            wx.hideLoading();
            wx.showLoading({
              title: '登录失败',
            });
          },
          complete: function () {
            //完成
          }
        })
      }
    }
  },
  phoneInput: function (e) {
    app.globalData.phone = e.detail.value;
  },
  codeInput: function (e) {
    app.globalData.code = e.detail.value;
  }
})