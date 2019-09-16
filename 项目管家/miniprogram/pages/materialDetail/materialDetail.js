// miniprogram/pages/materialDetail/materialDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialDetail: [],
    name: "",
    number: "",
    remark: "",
    time:"",
    billID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.billID=options.ID;
    wx.setNavigationBarTitle({
      title: options.address
    })
    let that = this;
    wx.showLoading({
      title: '获取详情',
    });
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Supervisor/billentries',
      data: {
        'BillID': options.ID
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            if(res.data.receiver===null){
              res.data.receiver ="";
            }
            if (res.data.phoneNumber === null) {
              res.data.phoneNumber = "";
            }
            if (res.data.deliveryDateStr === null) {
              res.data.deliveryDateStr = "";
            }
            if (res.data.remark===null){
              res.data.remark=""
            }
            that.setData({
              materialDetail: res.data.entries,
              name: res.data.receiver,
              number: res.data.phoneNumber,
              time: res.data.deliveryDateStr,
              remark: res.data.remark
            })
          } else {
            wx.showToast({
              title: JSON.stringify(res),
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: JSON.stringify(res),
            icon: 'none'
          })
        }

      }
    })
  },
  toPayOrder(e){
    this.data.re
    this.setData({
      time:e.detail.value
    })
  },
  //发送消息模板
  sendMessage(e){
    if(this.data.name.length===0){
      wx.showToast({
        title: '收货人姓名不能为空',
        icon:"none"
      })
      return;
    }
    if (this.data.number.length === 0) {
      wx.showToast({
        title: '收货人电话不能为空',
        icon: "none"
      })
      return;
    }else{
      if (this.data.number.length!==11){
        wx.showToast({
          title: '请正确填写收货人电话',
          icon: "none"
        })
        return;
      }
    }
    if(this.data.time.length===0){
      wx.showToast({
        title: '请选择送货时间',
        icon: "none"
      })
      return;
    }
    wx.showLoading({
      title: '通知中',
      icon:"none"
    })
    console.log( {
      "billID": this.data.billID,
      "receiver": this.data.name,
      "phoneNumber": this.data.number,
      "deliveryTime": this.data.time,
      "remark": this.data.remark
    })
    wx.request({
      method:"POST",
      url: 'https://pmapi.microfeel.net/api/Supervisor/DeliveryTime',
      data:{
        "billID": this.data.billID,
        "receiver": this.data.name,
        "phoneNumber": this.data.number,
        "deliveryTime": this.data.time,
        "remark": this.data.remark
      },
      success(res){
        wx.hideLoading();
        if(res.statusCode===200){
          if(res.data.code===0){
            wx.showModal({
              content: '通知供应商成功',
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
              title: JSON.stringify(res),
              icon:"none"
            })
          }
        } else {
          wx.showToast({
            title: JSON.stringify(res),
            icon: "none"
          })
        }
      }
    })
  },
  name(e){
    console.log(e)
    this.data.name = e.detail.detail.value;
  },
  phone(e){
    this.data.number = e.detail.detail.value;
  },
  remark(e){
    this.data.remark = e.detail.detail.value;
  }
})