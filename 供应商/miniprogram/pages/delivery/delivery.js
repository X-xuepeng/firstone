let app = getApp();
let pictures=[];
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
  onLoad: function(options) {
    app.globalData.ID = options.ID;
    let that = this;
    wx.showLoading({
      title: '获取主材',
      mask: true
    })
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/Supplier/Surplus',
      data: {
        BillID: options.ID
      },
      success: function(res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.result === 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].id = i;
            var listQuantity = {};
            listQuantity.id = i;
            listQuantity.Quantity = res.data.list[i].Quantity;
            that.data.listQuantity.push(listQuantity);
          }
          for (let item of res.data.list) {
            item.checked = true;
          }
          that.setData({
            list: res.data.list
          });
        } else {
          //TODO 错误处理
        }
      },
      fail: function(res) {
        wx.hideLoading();
        console.log(res);
        //错误处理
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
            success: function(res) {
              pictures.push('data:image/png;base64,'+res.data);
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
  //材料选择情况
  checkboxChange(e) {
    let lists = this.data.list;
    let ids = e.detail.value;
    for (let i = 0; i < lists.length; i++) {
      lists[i].checked = false;
      for (let j = 0; j < ids.length; j++) {
        if (lists[i].id == ids[j]) {
          lists[i].checked = true;
          break;
        }
      }
    }
    console.log(this.data.list)
  },
  //减少材料
  less: function(e) {
    let lists = this.data.list;
    let list = lists[e.target.id];
    if (list.Quantity > 1) {
      list.Quantity = list.Quantity - 1
    } else {
      wx.showToast({
        title: '最小数量是1',
        icon: 'none'
      })
    }
    this.setData({
      list: lists
    })
  },

  //添加材料
  add: function(e) {
    let lists = this.data.list;
    let list = lists[e.target.id];
    let maxQuantity = this.data.listQuantity[e.target.id];
    if (list.Quantity < maxQuantity.Quantity) {
      list.Quantity = list.Quantity + 1
    } else {
      wx.showToast({
        title: `最大数量是${maxQuantity.Quantity}`,
        icon: 'none'
      })
    }
    this.setData({
      list: lists
    })
  },
  //上传凭证
  uploadPicture: function(e) {
    var that = this;
    if (this.data.imageList.length === 0) {
      wx.showToast({
        title: '请至少添加一个凭证',
        icon: 'none'
      })
      return
    }
    let isSelected = true;
    let materials = [];
    for (let item of this.data.list) {
      if (item.checked) {
        let material = {};
        material.ID = item.ID;
        material.Quantity = item.Quantity;
        isSelected = false;
        materials.push(material);
      }
    }
    if (isSelected) {
      wx.showToast({
        title: '请选择为哪个主材添加送货凭证',
        icon: 'none'
      })
    }
    console.log(pictures)
    console.log(materials)
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    console.log(app.globalData.ID)
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/Supplier/Delivery',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        BillID: app.globalData.ID,
         Pictures: pictures,
        Details: materials
      },
      success(res) {
        console.log(res);
        wx.hideLoading();
        if(res.data.result===0){
          wx.redirectTo({
            url: `../orderDetail/orderDetail?ID=${app.globalData.ID}`
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon:'none'
        })
      }
    })
  }
})