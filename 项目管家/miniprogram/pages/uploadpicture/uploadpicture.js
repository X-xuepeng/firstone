let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    list: [],
    listQuantity: [],
    pictures: [],
    projectID:"",
    projectAddress:"",
    status:"",
    uploadPictureType:"",
    openId:"",
    phoneNumber:"",
    pictureStatus:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.data.projectID=options.projectID;
    this.data.projectAddress=options.projectAddress;
    this.data.status=options.status;
    this.data.openId=options.openId;
    this.data.phoneNumber=options.phoneNumber;
    switch(options.status){
      case '1':
        this.setData({
          uploadPictureType:"上传水电报检照片",
          pictureStatus:"水电报检"
        })
      break
      case '4':
        this.setData({
          uploadPictureType: "上传木瓦报检照片",
           pictureStatus: "木瓦报检"
        })
        break
      case '7':
        this.setData({
          uploadPictureType: "上传油整报检照片",
           pictureStatus: "油整报检"
        })
        break  
    }

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
   
    // console.log(JSON.stringify({
    //   "projectId": that.data.projectID,
    //   "photoList": that.data.pictures,
    //   "openId": that.data.openId,
    //   "acceptancePhase": parseInt(that.data.status)
    // }))
    wx.request({
      url: 'https://pmapi.microfeel.net/api/File/UploadAcceptancePhotos',
      method: 'POST',
      data: {
        "projectId": that.data.projectID,
        "photoList": that.data.pictures,
        "openId": that.data.openId,
        "acceptancePhase": parseInt(that.data.status)
      },
      success(res) {
    
      //   wx.hideLoading();
      if (res.statusCode === 200) {
       if (res.data.code === 0) {

         let pictures=[];
         for(let p of res.data.pictures){
           pictures.push("https://t.microfeel.net:12401/"+p);      
         }
         console.log({
           Phone: that.data.phoneNumber,
           ProjectID: that.data.projectID,
           ProjectAddress: that.data.projectAddress,
           PictureType: that.data.pictureStatus,
           Pictures: pictures
         })
         wx.request({
           method: "POST",
           url: 'https://meiquesync.microfeel.net/api/dept/CreateApprove',
           data: {
             Phone: that.data.phoneNumber,
             ProjectID: that.data.projectID,
             ProjectAddress: that.data.projectAddress,
             PictureType: that.data.pictureStatus,
             Pictures: pictures
           },
           success(res) {
             wx.hideLoading();
             wx.showModal({
               title: '上传成功',
               content: '上传照片成功',
               confirmText: "确定",
               success: function (res) {

                 if (res.confirm) {
                   wx.navigateBack({
                     delta: 2
                   })
                   wx.setStorageSync("refresh", false);
                 }
               }
             });
           },
           fail(res) {
          wx.hideLoading();
           wx.showToast({
             title: '上传失败',
             icon:"none"
           })
           }
         })
      
       
       }
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