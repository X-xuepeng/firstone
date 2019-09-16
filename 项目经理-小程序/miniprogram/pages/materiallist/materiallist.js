// miniprogram/pages/materiallist/materiallist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resources:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
      wx.showLoading({
        title: '获取材料列表',
        mask:true
      })
      wx.request({
        url: 'https://pmapi.microfeel.net/api/resource/getresources',
        success:function(res){
          if(res.data.code===0){
            wx.hideLoading();
            that.setData({
              resources: res.data.resources
            })
          }else{
            wx.hideLoading();
            wx.showToast({
              title: JSON.stringify(res.message),
              icon: 'none'
            })
          }
         
        },
        fail:function(res){
          wx.hideLoading();
           wx.showToast({
             title: JSON.stringify(res),
             icon:'none'
           })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

 shopcart:function(){
   wx.navigateTo({
     url: '../shopcart/shopcart'
   });
 },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 添加购物车
  addCart:function(e){
    wx.showLoading({
      title: '添加中...',
      mask:true
    })
   let projectID=wx.getStorageSync('projectID');
    wx.request({
      method:'post',
      url: 'https://pmapi.microfeel.net/api/ShoppingCart/add',
      data:{
        "projectID": projectID,
        "resourceID": e.currentTarget.id,
        "quantity": 1
      },
      success:function(res){
        if(res.data.code===0){
          wx.hideLoading();
          wx.showToast({
            title: '添加成功'
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '添加失败'+res.data.message,
          })
        }
       
      },
      fail:function(res){
        wx.hideLoading();
        wx.showToast({
          title: JSON.stringify(res)
        })
      }
    })
  }
})