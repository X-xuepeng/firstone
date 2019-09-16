const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const app = getApp();
Page({
  data: {
    showModal: false,
    orderDetail: {},
    isShow: false,
    date: year + '-' + month + '-' + day,
    showPhone: false,
    showPage: false,
    errorPage: false
  },

  /**
   * TODO手机号可更改
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.ID = options.ID;
    var that = this;
    wx.showLoading({
      title: '获取订单详情',
      mask: true
    })
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/WeChat/BillDetail',
      data: {
        BillID: options.ID
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading(); //隐藏对话框
        if (res.data.result === 0) { //成功
          that.setData({
            showPage: true
          })
          res.data.billdate = res.data.billdate.substring(0, 10);
          switch (res.data.status) {
            case 0: //未处理
              res.data.orderStatus = '未处理'
              res.data.orderStatusColor = '#999'
              res.data.orderDeal = true;
              res.data.orderSpot = false;
              res.data.orderFutures = false;
              res.data.orderService = false;
              break;
            case 1: //接单（现货）
              res.data.orderStatus = '接单(现货)'
              res.data.orderStatusColor = '#0bb20c'
              res.data.orderDeal = false;
              res.data.orderSpot = true;
              res.data.orderFutures = false;
              res.data.orderService = false;
              res.data.sp = true;
              break;
            case 2: //拒绝
              res.data.orderStatus = '拒绝'
              res.data.orderStatusColor = '#FF2D16'
              res.data.orderDeal = false;
              res.data.orderSpot = false;
              res.data.orderFutures = false;
              res.data.orderService = false;
              break;
            case 3: //接单（期货）
              res.data.orderStatus = '接单(期货),预计到货时间:' + res.data.extimatetime
              res.data.orderStatusColor = '#0bb20c'
              res.data.orderDeal = false;
              res.data.orderSpot = false;
              res.data.orderFutures = true;
              res.data.orderService = false;
              break;
            case 4: //已送货
              res.data.orderStatus = '已送达'
              res.data.orderStatusColor = '#ffe8a1'
              res.data.orderDeal = false;
              res.data.orderSpot = false;
              res.data.orderFutures = false;
              res.data.orderService = true;
              break;
            case 5: //已安装
              res.data.orderStatus = '已安装'
              res.data.orderStatusColor = '#118575'
              res.data.orderDeal = false;
              res.data.orderSpot = false;
              res.data.orderFutures = false;
              res.data.orderService = false;
              break;
          }
          that.setData({
            orderDetail: res.data
          })
        } else {
          that.setData({
            errorPage: true
          })
        }
      },
      fail: function(res) {
        wx.hideLoading(); //隐藏对话框
        that.setData({
          errorPage: true
        })
      }
    })
  },
  cancelOrder: function(e) { //拒绝订单
    this.setData({
      showModal: true
    })
  },
  acceptOrder: function(e) { //接订单
    this.setData({
      isShow: true
    })
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {
    this.hideModal();
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false,
      showPhone: false,
      changePhone: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    if (app.globalData.denialReason === undefined) {
      this.reason();
      return;
    } else if (app.globalData.denialReason.length === 0) {
      this.reason();
      return;
    } else {
      //网络请求，变更订单状态
      this.denial();
    }
  },
  inputChange: function(e) { //拒绝原因
    app.globalData.denialReason = e.detail.value;
  },
  reason: function() {
    wx.showToast({
      title: '请填写拒绝原因！',
      icon: 'none'
    })
    return;
  },
  //拒绝
  denial: function() {
    let that = this;
    this.hideModal();
    wx.showLoading({
      title: '拒绝',
      mask: true
    })
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/WeChat/Reject',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        BillID: app.globalData.ID,
        Status: 2,
        Reason: app.globalData.denialReason
      },
      success: function(res) {
        that.data.orderDetail.orderStatus = '拒绝'
        that.data.orderDetail.orderStatusColor = '#FF2D16'
        that.data.orderDetail.orderDeal = false;
        that.data.orderDetail.orderSpot = false;
        that.data.orderDetail.orderFutures = false;
        that.data.orderDetail.orderService = false;
        that.setData({
          orderDetail: that.data.orderDetail
        })
        wx.hideLoading();
      },
      fail: function(res) {
   
        wx.hideLoading();
        wx.showToast({
          title: '拒绝失败' + JSON.stringify(res),
          icon: 'none'
        })
      }
    })
  },
  //期货
  futures: function(e) {
    let that = this;
    this.setData({
      isShow: false
    })
    wx.showLoading({
      title: '接单',
      mask: true
    })
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/WeChat/ReceiveBill',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        BillID: app.globalData.ID,
        Status: 3,
        Reason: e.detail.value
      },
      success: function(res) {
        if (res.data.result === 0) {
          that.data.orderDetail.orderStatus = '接单(期货),预计到货时间:' + e.detail.value
          that.data.orderDetail.orderStatusColor = '#0bb20c'
          that.data.orderDetail.orderDeal = false;
          that.data.orderDetail.orderSpot = false;
          that.data.orderDetail.orderFutures = true;
          that.data.orderDetail.orderService = false;
          that.setData({
            orderDetail: that.data.orderDetail
          })
        } else {
          wx.showToast({
            title: '提交失败' + JSON.stringify(res),
            icon: 'none'
          })
        }
        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '提交失败' + JSON.stringify(res),
          icon: 'none'
        })
      }
    })
  },
  //取消时间选择
  cancelDate: function(e) {
    this.setData({
      isShow: false
    })
  },
  //现货
  spot: function(e) {
    this.setData({
      isShow: false,
      showPhone: true
    })
  },
  //将期货变成现货
  changeStatusToTwo: function() {
    this.setData({
      showPhone: true
    })
  },
  onCancelPhone: function(e) {
    this.hideModal();
  },
  onConfirmPhone: function(e) {
    this.hideModal();
    if (app.globalData.sendPhone === undefined) {
      wx.showToast({
        title: '请填写收货人手机号',
        icon: 'none'
      })
      return;
    } else if (app.globalData.sendPhone.length !== 11) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      })
      return;
    }
    let that = this;
    wx.showLoading({
      title: '变更状态',
      mask: true
    })
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/WeChat/ReceiveBill',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        BillID: app.globalData.ID,
        Phone: app.globalData.sendPhone,
        Status: 1,
      },
      success: function(res) {
        if (res.data.result === 0) {
          that.data.orderDetail.orderStatus = '接单(现货)'
          that.data.orderDetail.orderStatusColor = '#0bb20c'
          that.data.orderDetail.orderDeal = false;
          that.data.orderDetail.orderSpot = true;
          that.data.orderDetail.orderFutures = false;
          that.data.orderDetail.orderService = false;
          that.data.orderDetail.sp=true;
          that.setData({
            orderDetail: that.data.orderDetail
          })
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '变更失败' + JSON.stringify(res),
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '变更失败' + JSON.stringify(res),
          icon: 'none'
        })
      }
    })
  },
  phoneChange(e) {
    app.globalData.sendPhone = e.detail.value;
  },
  phoneChange1(e){
    app.globalData.changePhone=e.detail.value;
  },
  //主材送达,跳转添加图片
  delivery: function(e) {
    wx.navigateTo({
      url: `../delivery/delivery?ID=${app.globalData.ID}`,
    })
  },
  //主材安装
  install: function(e) {
    wx.navigateTo({
      url: `../install/install?ID=${app.globalData.ID}`,
    })
  },
  //更换手机号
  changePhone:function(e){
   this.setData({
     changePhone:true
   })
  },
  //取消更换手机号
  changeCancle:function(e){
    this.hideModal();
  },
  //确认更换手机号
  changeConfirm:function(e){
    this.hideModal();
    if (app.globalData.changePhone === undefined) {
      wx.showToast({
        title: '请更换收货人手机号',
        icon: 'none'
      })
      return;
    } else if (app.globalData.changePhone.length !== 11) {
      wx.showToast({
        title: '请更换正确手机号',
        icon: 'none'
      })
      return;
    }
    let that = this;
    wx.showLoading({
      title: '更换手机号',
      mask: true
    })
    wx.request({
      url: 'https://dingtalk.microfeel.net:12401/api/WeChat/ChangePhone',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        BillID: app.globalData.ID,
        Phone: app.globalData.phoneChange,
        Status: 1,
      },
      success: function (res) {
        if (res.data.result === 0) {
          that.data.orderDetail.phone = app.globalData.changePhone
          that.setData({
            orderDetail: that.data.orderDetail
          })
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '更换手机号失败' + JSON.stringify(res),
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '更换手机号失败' + JSON.stringify(res),
          icon: 'none'
        })
      }
    })
  }
})