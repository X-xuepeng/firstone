// miniprogram/pages/assignwork/assignwork.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [
      // { name: '张三', phone: '15776650192', value:0, checked: true },
      // { name: '李四', phone: '15776650192',value:1 }
    ]
  },
  checkboxChange: function(e) {
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let technologyTitle=wx.getStorageSync('technologyTitle');
    wx.setNavigationBarTitle({
      title: technologyTitle,
    })
    wx.showLoading({
      title: '获取工人',
      mask: true
    })
    let that = this;
    let projectID=wx.getStorageSync('projectID');
    let processID = wx.getStorageSync('processID');
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Worker/getTechnologyWorkers',
      method: 'GET',
      data: {
        'technologyId': processID,
        'projectId':projectID
      },
      success: function(res) {
        wx.hideLoading();
        if(res.statusCode===200){
        if (res.data.code === 0) {        
          for (let i = 0; i < res.data.t_Workers.length; i++) {
            res.data.t_Workers[i].value = i;
            res.data.t_Workers[i].checked = false;
          }
          that.setData({
            checkboxItems: res.data.t_Workers
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        }else{
          wx.showToast({
            title: JSON.stringify(res),
            icon: 'none'
          })
        }
      },
      fail: function(error) {
        wx.showToast({
          title: JSON.stringify(error),
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //指派
  assign: function() {
   let worker= this.data.checkboxItems.filter(function(item){
      return item.checked;
    })
   if(worker.length===0){
     wx.showToast({
       title: '请进行指派',
       icon:'none'
     })
     return;
   }
   let workerIDs=[];
   for(let i=0;i<worker.length;i++){
     workerIDs.push(worker[i].id);
   }
   wx.showLoading({
     title: '指派中',
     mask:true
   })
   let projectID=wx.getStorageSync('projectID');
   let processID=wx.getStorageSync('processID');
   wx.request({
     method:'post',
     url: 'https://pmapi.microfeel.net/api/Project/submitWorkers',
     data:{
       'projectId':projectID,
       'technologyEntityId':processID,
       'workerIds': workerIDs
     },
     success(res){
       console.log(res)
       wx.hideLoading();
       if(res.data.code===0){
         wx.showModal({
           content: '指派工人成功',
           showCancel: false,
           success: function (res) {
             if (res.confirm) {
              wx.navigateBack({
                delta:1
              })
             }
           }
         });
       }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
       }
     },
     fail(error){
       wx.showToast({
         title: res.data.message,
         icon: JSON.stringify(error)
       })
     }
   })
  }
})