// miniprogram/pages/projectInfo/projectInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectDetail:{},
    personnel:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.showLoading({
      title: '详情',
    })
    let projectID=wx.getStorageSync('projectID');
      wx.request({
        url: 'https://pmapi.microfeel.net/api/Project/GetProjectMembers',
        data:{
          'projectId':projectID
        },
        success(res){ 
          if(res.statusCode===200){
            if(res.data.code===0){
              wx.hideLoading();
              that.setData({
                projectDetail: res.data.project,
                personnel: res.data.employees
              })
            }else{
              wx.hideLoading();
              wx.showToast({
                title: JSON.stringify(res),
              })
            }
          }else{
            wx.hideLoading();
            wx.showToast({
              title: JSON.stringify(res),
            })
          }
         
        },
        fail(error){  
            console.log(error)
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