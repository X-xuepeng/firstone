// miniprogram/pages/orderList/orderList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    isNull: false,
    isError: false,
    openId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.openId = options.openId;
  },
  onShow:function(){
    let that = this;
    wx.showLoading({
      title: '获取项目列表',
      mask: true
    })

    wx.request({
      method: "get",
      url: 'https://dingtalk.microfeel.net:12401/api/wechat/Bill',
      data: {
        Openid: that.data.openId
      },
      success: function (res) {
        if (res.data.result === 0) {
          if (res.data.list.length !== 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].id = i;
            }
            for (let order of res.data.list) {
              switch (order.SupStatus) {
                case 0: //未处理
                  order.color = '#bee5eb';
                  order.type = '未处理';
                  break;
                case 1: //接单
                  order.color = '#0bb20c';
                  order.type = '已接单';
                  break;
                case 2: //拒绝
                  order.color = '#FF2D16';
                  order.type = '已拒绝';
                  break;
                case 3: //接单（期货）
                  order.color = '#0bb20c';
                  order.type = '接单（期货）';
                  break;
                case 4: //发货
                  order.color = '#ffe8a1';
                  order.type = '已送达';
                  break;
                case 5: //安装
                  order.color = '#118575';
                  order.type = '已安装';
                  break;
              }
            }
            that.setData({
              orderList: res.data.list
            })
          } else {
            that.setData({
              isNull: true
            })
          }
        } else {
          that.setData({
            isError: true
          })
        }
        wx.hideLoading();

      },
      fail: function (res) {
        wx.hideLoading();
      }
    })
  },
  orderDetail: function(e) {
    if (this.data.orderList[e.currentTarget.id].SupStatus === 2) {
      wx.showToast({
        title: '此单为不接订单',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: `../orderDetail/orderDetail?ID=${this.data.orderList[e.currentTarget.id].ID}`,
    })
  }
})