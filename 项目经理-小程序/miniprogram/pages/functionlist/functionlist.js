// miniprogram/pages/functionlist/functionlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let projectAddress = wx.getStorageSync('projectAddress');
    wx.setNavigationBarTitle({
      title: projectAddress
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  picking: function() {
    wx.navigateTo({
      url: '../materiallist/materiallist'
    });
  },
  worker_info: function() {
    wx.navigateTo({
      url: '../fillworkerinfo/fillworkerinfo'
    });
  },
  //指派工人
  assign_worker: function() {
    wx.navigateTo({
      url: '../assign/assign'
    });
  },
  //获取项目详情
  getProjectInfo(e) {
    wx.navigateTo({
      url: '../projectInfo/projectInfo',
    })
  },
  //项目预算
  project_money(e) {
    wx.navigateTo({
      url: '../projectbudget/projectbudget',
    })
  },
  //进入图纸页
  drawing: function(e) {
    wx.navigateTo({
      url: '../drawing/drawing',
    })
  },
  //进场照片
  arrival: function(e) {
    wx.navigateTo({
      url: '../arrival/arrival',
    })
  },
  //其他
  file(e) {
    wx.navigateTo({
      url: '../file/file',
    })
  },
  //收支明细
  income(e) {
    wx.navigateTo({
      url: '../income/income',
    })
  },
  //报检
  checker(e) {
    wx.navigateTo({
      url: '../roomprocess/roomprocess',
    })
  },
  //手机解绑
  unbind(e) {
    let openID = wx.getStorageSync('openId');
    let phoneNumber = wx.getStorageSync('phoneNumber');
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
      fail(error) {}
    })

  }
})