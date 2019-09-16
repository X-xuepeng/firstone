let app = getApp();
let pictures = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    list: [],
    listQuantity: []
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
              pictures.push('data:image/png;base64,' + res.data);
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
    console.log(pictures)
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/Supplier/Install',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        BillID: app.globalData.ID,
        Pictures: pictures,
      },
      success(res) {
        wx.hideLoading();
        if (res.data.result === 0) {
          wx.redirectTo({
            url: `../orderDetail/orderDetail?ID=${app.globalData.ID}`
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  }
})