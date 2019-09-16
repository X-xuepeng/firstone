Page({

  /**
   * 页面的初始数据
   */
  data: {
      ip:"",
      message:"",
      access_token:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let access_token = wx.getStorageSync('access_token');
   this.data.access_token = access_token;
   let ip= options.ip;
    this.setData({
      ip:ip
    })
  },
  detail(event){
    this.data.message=event.detail;
  },
  addProductLine(e){
    if(this.data.message===""){
      wx.showToast({
        title: '请添加对生产线的描述',
        icon:"none"
      })
      return
    }
      wx.showLoading({
        title: '添加中...',
      });
      let that=this;
      wx.request({
        url: 'https://workshopapi.gopas.com.cn/api/Machine',
        method:"POST",
        header: {
           "Authorization":`Bearer ${that.data.access_token}`,
        }, 
        data:{
          "ip": that.data.ip,
          "remark": that.data.message
        },
        success(res){
          wx.hideLoading();
          if (res.statusCode === 401){ //token过期
            wx.reLaunch({
              url: `../authentication/authentication`
            });
            wx.setStorageSync('access_token', '');
          }else if(res.statusCode===200){
            if (res.data.Code === 200) {  //成gong            
               wx.navigateBack({
                delta: 1
               })
            }else{
                wx.showToast({
                  title: '添加失败'+JSON.stringify(res),
                  icon:"none"
                })
            }
          }else{
            wx.showToast({
              title: '添加失败'+JSON.stringify(res),
              icon: "none"
            })
          }
        
        }
      })
  }
})