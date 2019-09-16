let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    list: [],
    listQuantity: [],
    remark:'',
    buttonTitle:'上传记录',
    type:'success',
    style:"进度",
    pictures :[],
    budgetId:'',
    navProgress:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.budgetId=options.budgetId;
    let that=this;
    let technologyTitle= wx.getStorageSync('technologyTitle');
    wx.setNavigationBarTitle({
      title: technologyTitle
    })
    wx.showLoading({
      title: '获取项目进度',
      mask:true
    })
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Technology/GetProgress',
      data:{
        budgetId: that.data.budgetId
      },
      success(res){
        if(res.statusCode===200){
          if(res.data.code===0){
            wx.hideLoading();
            that.setData({
              progress: res.data.progress
            })
            that.data.navProgress = res.data.progress
          }else{
            wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
        }else{
          wx.hideLoading();
          wx.showToast({
            title: JSON.stringify(res),
            icon: 'none'
          })
        }
      }
    })
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
    if (this.data.imageList.length === 0&&this.data.remark==='') {
      wx.showToast({
        title: '请至少添加一个凭证或者上传备注文本',
        icon: 'none'
      })
      return
    }
    if (that.data.navProgress<=this.data.progress){
      wx.showToast({
        title: '请增加进度再继续上传',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    let projectID = wx.getStorageSync('projectID');
   let processID= wx.getStorageSync('processID');
   if(that.data.navProgress===100){
     wx.request({
       url: 'https://pmapi.microfeel.net/api/File/UploadAcceptancePhotos',
       method: 'POST',
       data: {
         "projectId": projectID,
         "budgetId": that.data.budgetId,
         "photoList": that.data.pictures,
         "remark": that.data.remark
       },
       success(res) {
         wx.hideLoading();
         if (res.statusCode === 200) {
           if (res.data.code === 0) {
             wx.showModal({
               content: '上传竣工记录成功',
               showCancel: false,
               success: function (res) {
                 if (res.confirm) {
                   wx.navigateBack({
                     delta: 1
                   })
                 }
               }
             });
           } else {
             wx.showToast({
               title: '上传失败' + JSON.stringify(res),
               icon: 'none'
             })
           }
         } else {
           wx.showToast({
             title: '上传失败' + JSON.stringify(res),
             icon: 'none'
           })
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
   }else{
    wx.request({
      url: 'https://pmapi.microfeel.net/api/File/UploadProgressPhotos',
      method: 'POST',
      data: {
        "projectId": projectID,
        "budgetId": that.data.budgetId,
        "photoList": that.data.pictures,
        "remark":that.data.remark,
        "progress": that.data.navProgress
      },
      success(res) {
        console.log(res)
        wx.hideLoading();
        if(res.statusCode===200){
          if(res.data.code===0){
            wx.showModal({
              content: '上传项目进度记录成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            });
          }else{
            wx.showToast({
              title: '上传失败'+JSON.stringify(res),
              icon: 'none'
            })
          }
        }else{
          wx.showToast({
            title: '上传失败' + JSON.stringify(res),
            icon: 'none'
          })
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
  },
  //滑块滑动大小
  sliderChange(e){
     this.data.navProgress=e.detail.value;
    if (this.data.navProgress<this.data.progress){
       this.setData({
         progress:this.data.progress
       })
     }
    if (e.detail.value===100){
      this.setData({
        buttonTitle:'工艺竣工',
        type: 'error',
        style: "竣工"
      })
    }else{
      this.setData({
        buttonTitle: '上传记录',
        type: 'success',
        style: "进度"
      })
    }
  },
  remark: function (e) {
    this.data.remark = e.detail.detail.value
  },
})