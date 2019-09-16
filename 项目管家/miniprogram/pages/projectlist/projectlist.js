// pages/projectlist/projectlist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    projects: [],
    isNull: false,
    isError: false,
    openId: '',
    pmId: '',
    phoneNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.openId = options.openId;
    this.data.phoneNumber = options.phoneNumber;
    let openId = options.openId;
    wx.setStorageSync('refresh', false);
    this.onShow();
  },
  onShow: function () {
    let refresh = wx.getStorageSync('refresh');
    if (!refresh) {
      let that = this;
      wx.showLoading({
        title: '获取项目',
      });
      wx.request({
        url: 'https://pmapi.microfeel.net/api/Supervisor/GetProjects',
        data: {
          'openid': that.data.openId
        },
        success: function (res) {
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              if (res.data.projects.length === 0) {
                that.setData({
                  isNull: true
                })
              } else {
                that.setData({
                  projects: res.data.projects
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
    }
  },
  /**
   * 跳转功能列表吗
   */
  project: function (e) {
    let that = this;
    let project = this.data.projects.find(function (project) {
      return project.id === e.currentTarget.id
    });
    wx.setStorageSync('projectAddress', project.address)
    wx.setStorageSync('projectID', e.currentTarget.id);
    wx.navigateTo({
      url: `../functionlist/functionlist?openId=${that.data.openId}&phoneNumber=${that.data.phoneNumber}&pmId=${that.data.pmId}&projectAddress=${project.address}&projectID=${e.currentTarget.id}&acceptancePhase=${project.acceptancePhase}`
    });
  },
  // 显示地址
  location: function (e) {
    let project = this.data.projects.find(function (project) {
      return project.id === e.currentTarget.id
    });
    wx.openLocation({
      longitude: Number(project.longitude),
      latitude: Number(project.latitude),
      address: project.address
    })
  }
})