// miniprogram/pages/assign/assign.js
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
    let projectID=wx.getStorageSync('projectID');

    var that=this;
    wx.showLoading({
      title: '获取工艺',
      mask:true
    })
      wx.request({
        method:'GET',
        url: 'https://pmapi.microfeel.net/api/Resource/getprojecttechnologies',
        data:{
          projectId:projectID
        },
        success:function(res){
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              if (res.data.p_Technologies.length === 0) {
                that.setData({
                  isNull: true
                })
              } else {
                that.setData({
                  p_Technologies: res.data.p_Technologies
                })
              }
              wx.hideLoading();
            } else {
              wx.hideLoading();
              wx.showToast({
                title: JSON.stringify(res.data.message),
                icon: 'none'
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
        fail:function(error){
            wx.hideLoading();
          wx.showToast({
            title: JSON.stringify(error),
            icon: 'none'
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  click:function(e){
    let project = this.data.p_Technologies.find(function (project) {
      return project.id === e.currentTarget.id
    });
    wx.setStorageSync('processID',e.target.id); 
    wx.setStorageSync('technologyTitle', project.name);
      wx.navigateTo({
        url: '../assignwork/assignwork',
      })
  }
})