let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    list: [],
    listQuantity: [],
    pictures:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.ID = options.ID;
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let FileSystemManager = wx.getFileSystemManager();
        for (let path of res.tempFilePaths) {
          console.log(path);
          FileSystemManager.readFile({
            filePath: path,
            encoding: 'base64',
            success: function (res) {
              that.data.pictures.push('data:image/jpg;base64,' + res.data);
            }
          });
        }
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  //预览图片
  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },
  //上传凭证
  uploadPicture: function (e) {
    var that = this;
    if (this.data.imageList.length === 0) {
      wx.showToast({
        title: '请至少添加一个凭证',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
  let projectID=wx.getStorageSync('projectID');
    wx.request({
      url: 'https://pmapi.microfeel.net/api/File/UploadArrivalPhotos',
      method: 'POST',
      data: {
        "projectId": projectID,
        "photoList": that.data.pictures
      },
      success(res) { 
        wx.hideLoading();
        if(res.statusCode===200){
          if(res.data.code===0){
            wx.showModal({
              title: '继续上传',
              content: '上传进场照片成功',
              confirmText: "继续上传",
              cancelText: "返回上级",
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    imageList: [],
                    list: [],
                    listQuantity: []
                  })
                  that.data.pictures = []
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            });
          }else{
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        }else{
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
   
      },
      fail(res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  }
})