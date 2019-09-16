// miniprogram/pages/projectbudget/projectbudget.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
      name: 'name1',
      technologyAndSteps:[],
    isNull: false,
    isError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
      wx.showLoading({
        title: '预算',
      })
      let projectID=wx.getStorageSync('projectID');
      wx.request({
        url: 'https://pmapi.microfeel.net/api/Technology/GeTechnologyAndSteps',
        method:'GET',
        data:{
          projectId:projectID
        },
        success(res){
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              if (res.data.technologyAndSteps.length === 0) {
                that.setData({
                  isNull: true
                })
              } else {
                that.setData({
                  technologyAndSteps: res.data.technologyAndSteps
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
        fail(error){
            wx.hideLoading();
     
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})