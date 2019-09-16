// miniprogram/pages/functionlist/functionlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      billNo:'',
      openId:'',
      id:0,
      companyId:'',
      status:'',
      materialStatus:'',
      replayStatus:'',
      recordsStatus:'',
      replayShow:true,
      recordsShow:true,
      orderComplete:true,
      orderDesc:'',
      AllowReturnAndStore:'',
      materialDesc:'',
      materialComplete:true,
      productComplete:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.data.billNo=options.BillNO;
   this.data.openId=options.openId;
   this.data.companyId=options.companyId;
   this.data.status=options.status
    this.data.AllowReturnAndStore = options.AllowReturnAndStore;
   wx.setNavigationBarTitle({
     title:this.data.billNo+'(功能表)',
   })
   if(this.data.status==="true"){
     this.setData({
       materialStatus: '订单已领料查看明细',
       replayStatus: '订单已领料可退料',
       recordsStatus: '订单已领料可入库',
       replayShow: true,
       recordsShow: true,
       materialComplete: false,
       materialDesc: '领料完成'
     })
   }else{
     if (this.data.AllowReturnAndStore==="false"){
       this.setData({
         materialStatus: '查看明细',
         replayStatus: '订单为临时单不可退料',
         recordsStatus: '订单为临时单不可入库',
         replayShow: false,
         recordsShow: false,
         orderComplete: false,
         orderDesc: '订单已完结'
         
       })
     }else{
       this.setData({
         materialStatus: '订单未领料查看明细',
         replayStatus: '订单未领料不可退料',
         recordsStatus: '订单未领料不可入库',
         replayShow: false,
         recordsShow: false,
         orderComplete: true
       })
     }
    
   }
  },
  receive(e){
    wx.navigateTo({
      url: `../projectDetail/projectDetail?openId=${this.data.openId}&id=${this.data.id}&companyId=${this.data.companyId}&BillNO=${this.data.billNo}&status=${this.data.status}`
    })
  },
  //成品入库
  finishproduct(e){
    if (this.data.status === "false") {
      wx.showToast({
        title: '该订单未领料,请勿入库操作',
        icon: "none"
      })
      return
    }else{
      if (this.data.AllowReturnAndStore === "false") {
        wx.showToast({
          title: '该订单为临时单,请勿入库操作',
          icon: "none"
        })
        return
      }
    }
    wx.navigateTo({
      url: `../finishproduct/finishproduct?openId=${this.data.openId}&id=${this.data.id}&companyId=${this.data.companyId}&BillNO=${this.data.billNo}&status=${this.data.status}`
    })
  },
  //订单已领料
  // materialFinish(event){
  //   let that = this;
  //   if (this.data.status === "true") {
  //     wx.showToast({
  //       title: '该订单已领料完成,请勿重复操作',
  //       icon: "none"
  //     })
  //     return
  //   }
  //   wx.showModal({
  //     content: '订单已领料',
  //     showCancel: true,
  //     success: function (res) {
  //       if (res.confirm) { //确认
  //         wx.showLoading({
  //           title: '领料完成',
  //           mask: true
  //         })
  //         wx.request({
  //           url: 'https://api.gopas.com.cn/api/WorkShop/SetPPBomOver',
  //           method: 'post',
  //           data: {
  //             openid: that.data.openId,
  //             id: that.data.id
  //           },
  //           success(res) {
  //             wx.hideLoading();
  //             if (res.statusCode === 200) {
  //               if (res.data.Code === 200) {
  //                 that.setData({
  //                   materialStatus: '订单已领料查看明细',
  //                   replayStatus: '订单已领料可退料',
  //                   recordsStatus: '订单已领料可入库',
  //                   replayShow: true,
  //                   recordsShow: true,
  //                   materialComplete: false,
  //                   materialDesc: '领料完成',
  //                  status:"true"
  //                 })
  //                 wx.setStorageSync("isNeedFlesh", false);

  //               } else {
  //                 wx.showToast({
  //                   title: '领料失败' + JSON.stringify(res),
  //                 })
  //               }
  //             } else {

  //               wx.showToast({
  //                 title: '领料失败' + JSON.stringify(res),
  //               })
  //             }
  //           }
  //         })
  //       } else if (res.cancel) { //取消

  //       }
  //     }
  //   });
  // },

  //订单领料明细
  beginPicking(event){
    wx.navigateTo({
      url: `../picking/picking?openId=${this.data.openId}&id=${this.data.id}&companyId=${this.data.companyId}&BillNO=${this.data.billNo}&status=${this.data.status}`,
    })
  },

    //点击完成
  complete(event) {
    let that = this;
    wx.showModal({
      content: '订单完结',
      showCancel: true,
      success: function (res) {
        if (res.confirm) { //确认
          wx.showLoading({
            title: '订单完结',
            mask: true
          })
          wx.request({
            url: 'https://api.gopas.com.cn/api/WorkShop/OverOrder',
            method: 'post',
            data: {
              openid: that.data.openId,
              id: that.data.id,
              companyid:that.data.companyId
            },
            success(res) {
              wx.hideLoading();
              if (res.statusCode === 200) {
                if (res.data.Code === 200) {
                  wx.reLaunch({
                    url: `../projectlist/projectlist?openId=${that.data.openId}`
                  });
                } else {
                  wx.showToast({
                    title: '订单完结失败' + JSON.stringify(res),
                    icon: 'none'
                  })    
                }
              } else {
                wx.showToast({
                  title: '订单完结失败' + JSON.stringify(res),
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.cancel) { //取消

        }
      }
    });
  },
  //退料
  retreat(e){
    if (this.data.status === "false") {
      wx.showToast({
        title: '该订单未领料,请勿退料操作',
        icon: "none"
      })
      return
    }else{
      if (this.data.AllowReturnAndStore === "false") {
        wx.showToast({
          title: '该订单为临时单,请勿退料操作',
          icon: "none"
        })
        return
      }
    }
    wx.navigateTo({
      url: `../retreatmaterial/retreatmaterial?openId=${this.data.openId}&id=${this.data.id}&companyId=${this.data.companyId}&BillNO=${this.data.billNo}&status=${this.data.status}`
    })
  }, 
  //生产任务单完结
  productFinsh(e){
      wx.showLoading({
        title: '生产任务单完结',
        icon:"none"
      })
      let that=this;
      wx.request({
        url: 'https://api.gopas.com.cn/api/WorkShop/GetPpbomsOfIcmo',
        method:"GET",
        data:{
          openid: that.data.openId, 
          companyid: that.data.companyId,
          id: that.data.id
        },
        success(res){
            wx.hideLoading();
            if(res.statusCode===200){
              if(res.data.Code===200){
                console.log(JSON.stringify(res))
                let content="";
                for (let i = 0; i < res.data.Datas.length;i++){
                  if (i=== (res.data.Datas.length-1)){
                    content += res.data.Datas[i].BillNO
                  }else{
                    content += res.data.Datas[i].BillNO + ",";
                  }
                }
                wx.showModal({
                  title:"生产任务单完结",
                  content: `订单${content}是否全部完结`,
                  showCancel: true,
                  success: function (res) {
                    if (res.confirm) {
                      wx.showLoading({
                        title: '生产任务单完结',
                        icon:"none"
                      })
                      wx.request({
                        url: 'https://api.gopas.com.cn/api/WorkShop/SetOverIcmo',
                        method:"GET",
                        data:{
                          openid: that.data.openId,
                          companyid: that.data.companyId,
                          id: that.data.id
                        },
                        success(res){
                          wx.hideLoading();
                          if (res.statusCode === 200) {
                            if (res.data.Code === 200) {
                              wx.reLaunch({
                                url: `../projectlist/projectlist?openId=${that.data.openId}`
                              });
                            } else {
                              wx.showToast({
                                title: '生产任务单完结失败' + JSON.stringify(res),
                                icon:'none'
                              })
                            }
                          } else {
                            wx.showToast({
                              title: '生产任务单完结失败' + JSON.stringify(res),
                              icon: 'none'
                            })
                          }
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
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
  }
})