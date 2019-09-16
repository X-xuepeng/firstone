// pages/projectlist/projectlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projects: [],
    isNull: false,
    isError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '获取项目',
    });
    let openId = wx.getStorageSync('openId');
    wx.request({
      url: 'https://pmapi.microfeel.net/api/project/getprojects',
      data: {
        'openid': openId
      },
      success: function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 0) {  
            if (res.data.projects.length === 0) {
              that.setData({
                isNull: true
              })
            }else{
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
        }else{
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
      fail: function(res) {
             
      }
    })
  },

  /**
   * 跳转功能列表吗
   */
  project: function(e) {
    let project = this.data.projects.find(function(project) {
      return project.id === e.currentTarget.id
    });
    wx.setStorageSync('projectAddress', project.address)
    wx.setStorageSync('projectID', e.currentTarget.id);

    wx.navigateTo({
      url: '../functionlist/functionlist'
    });
  },
  // 显示地址
  location:function(e){
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