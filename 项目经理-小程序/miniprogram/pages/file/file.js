// miniprogram/pages/file/file.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileCategories: [],
    files: [],
    isNull: false,
    isError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let files = [];
    wx.showLoading({
      title: '获取文件',
    })
    let projectID = wx.getStorageSync('projectID');
    wx.request({
      url: 'https://pmapi.microfeel.net/api/File/GetProjectFiles1',
      data: {
        projectId: projectID,
        type: 2
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            if (res.data.fileCategories.length !== 0) {
              for (let file of res.data.fileCategories) {
                for (let url of file.files) {
                  switch (url.split('.')[url.split('.').length - 1]) {
                    case 'docx':
                      let file = {
                        'name': '合同',
                        'image': '../../image/docx.png',
                        'url': url
                      }
                      files.push(file);

                      break;
                  }

                }
              }
              that.setData({
                fileCategories: res.data.fileCategories,
                files: files
              })
            } else {
              that.setData({
                isNull: true
              })
            }
          } else {
            wx.showToast({
              title: JSON.stringify(res),
              icon:'none'
            })
            that.setData({
              isError: true
            })
          }
        } else {
          wx.showToast({
            title: JSON.stringify(res),
            icon: 'none'
          })
          that.setData({
            isError: true
          })
        }


      },
      fail(error) {
        // wx.hideLoading();
        // wx.showToast({
        //   title: JSON.stringify(error),
        // })
      }
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
  // 显示文件
  show(e) {
    console.log(e)
    wx.navigateTo({
      url: '../showfile/showfile?url=' + e.currentTarget.id,
    })
  }
})