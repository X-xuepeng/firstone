Page({

  data: {
    oneChecked: true,
    tags: [],
    Name: '',
    Phone: '',
    IDCardNumber: '',
    BankCardNumber: '',
    IDCardList: [],
    BankCardList: [],
    list: [],
    listQuantity: [],
    bankPicture:'',
    idPicture : ''
  },
  oneChange(event) {
    this.setData({
      'oneChecked': event.detail.checked
    })
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['tags[' + event.detail.name + '].checked']: detail.checked
    })
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: '获取工艺',
      mask: true
    })
    wx.request({
      method: 'GET',
      url: 'https://pmapi.microfeel.net/api/Resource/gettechnologies',
      data: {},
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        for (let i = 0; i < res.data.technologies.length; i++) {
          res.data.technologies[i].color = 'green';
        }
        if (res.data.code === 0) {
          that.setData({
            tags: res.data.technologies
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      },
      fail: function(error) {
        wx.showToast({
          title: JSON.stringify(error),
          icon: "none"
        })
      }
    })

  },
  //填写工人资料
  clickWorkerInfo: function(res) {
    let list = this.data.tags.filter(function(tagsChecked) {
      return tagsChecked.checked
    })
    if (list.length === 0) {
      wx.showToast({
        title: '请选择至少一个工艺',
        icon: 'none'
      })
      return;
    }
    let that = this;
    let data = this.data;
    let tags = [];
    for (let i = 0; i < list.length; i++) {
      tags.push(list[i].id);
    }
    if (data.Name === '' || data.Phone === '' || this.data.bankPicture === '' || this.data.idPicture === '') {
      if(data.Phone.length!==11){
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      }
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    wx.request({
      method: 'post',
      url: 'https://pmapi.microfeel.net/api/Worker/create',
      data: {
        "Name": data.Name,
        "Phone": data.Phone,
        "bankPicture": that.data.bankPicture,
        "idPicture": that.data.idPicture,
        'Remark': data.Remark,
        "technologyIds": tags
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code === 0) {
          wx.showModal({
            title: '添加工人',
            content: '添加工人成功',
            confirmText: "继续添加",
            cancelText: "返回上级",
            success: function(res) {

              if (res.confirm) {
                let tags = data.tags;
                for (let i = 0; i < tags.length; i++) {
                  tags[i].checked = false;
                }
                that.setData({
                  tags: tags,
                  Name: '',
                  Phone: '',
                  IDCardList: [],
                  BankCardList: [],
                  Remark: ''
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail: function(error) {
        wx.hideLoading();
        wx.showToast({
          title: JSON.stringify(error),
          icon:'none'
        })
      }
    })
  },
  Name: function(e) {
    this.data.Name = e.detail.detail.value
  },
  Phone: function(e) {
    this.data.Phone = e.detail.detail.value
  },
  Remark: function(e) {
    this.data.Remark = e.detail.detail.value
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let FileSystemManager = wx.getFileSystemManager();
        for (let path of res.tempFilePaths) {
          FileSystemManager.readFile({
            filePath: path,
            encoding: 'base64',
            success: function(res) {
              that.data.idPicture = 'data:image/jpg;base64,' + res.data;
            }
          });
        }
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          IDCardList: res.tempFilePaths
        })
      }
    })
  },
  //预览图片
  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current,
      urls: this.data.IDCardList
    })
  },
  //银行卡
  bankChooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let FileSystemManager = wx.getFileSystemManager();
        for (let path of res.tempFilePaths) {
          console.log(path);
          FileSystemManager.readFile({
            filePath: path,
            encoding: 'base64',
            success: function(res) {
              that.data.bankPicture = 'data:image/jpg;base64,' + res.data;
            }
          });
        }
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          BankCardList: res.tempFilePaths
        })
      }
    })
  },

  bankImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current,
      urls: this.data.BankCardList
    })
  }
});