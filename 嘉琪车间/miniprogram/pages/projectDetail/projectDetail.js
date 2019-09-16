// miniprogram/pages/projectDetail/projectDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      Datas:[],
      openid:"",
      id:"",
      buttonStatus:"primary",
      status:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.setNavigationBarTitle({
      title: options.BillNO+'(投料单明细)',
    })
    wx.showLoading({
      title: '获取投料单明细',
      mask:true
    })
    this.data.openid = options.openId;
    this.data.id=options.BillNO;
    this.data.status=options.status;
    if (options.status==="true"){
      this.setData({
        buttonStatus: "danger"
      })
    }else{
      this.setData({
        buttonStatus: "primary"
      })
    }
      wx.request({
        method: 'get',
        url: 'https://api.gopas.com.cn/api/WorkShop/PPBomEntry',
        data:{
          openid:options.openId,
          companyid:options.companyId,
          billno: options.BillNO
        },
        success(res){      
          wx.hideLoading();
          if(res.statusCode===200){
            if(res.data.Code===200){
              if(res.data.Datas.length!==0){
                that.setData({
                  Datas: res.data.Datas
                })
              }else{
                that.list_empty();
              }
            }else{
              that.net_error();
            }
          }else{
            that.net_error();
          }
         
        }
      })
  },
  //列表为空
  list_empty() {
    this.setData({
      isNull: true,
      isShow: "hide",
      emptyShow: ""
    })
  },
  //网络请求错误
  net_error() {
    this.setData({
      isError: true,
      isShow: "hide"
    })
  }
})