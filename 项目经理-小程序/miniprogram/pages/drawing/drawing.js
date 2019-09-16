// miniprogram/pages/drawing/drawing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileCategories:[],
    url:[],
    isNull: false,
    isError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
      wx.showLoading({
        title: '获取图片',
      })
      let projectID=wx.getStorageSync('projectID');
      console.log(projectID)
      wx.request({
        url: 'https://pmapi.microfeel.net/api/File/GetProjectFiles',
        data:{
          projectId:projectID,
          type:0
        },
        success(res){
          console.log(res)
          if(res.statusCode===200){
            if(res.data.code===0){
              // for (let i = 0; i < res.data.fileCategories.length; i++) {
              //   for (let j = 0; j < res.data.fileCategories[i].files.length; j++) {
              //     res.data.fileCategories[i].files[j] = "https://pmapi.microfeel.net/" + res.data.fileCategories[i].files[j];
              //   }

              // }
              for (let i = 0; i < res.data.fileCategories.length; i++) {
                for (let j = 0; j < res.data.fileCategories[i].files.length; j++) {
                  that.data.url.push(res.data.fileCategories[i].files[j])
                }
              }
              if (res.data.fileCategories.length === 0) {
                that.setData({
                  isNull: true
                })
              }else{
                that.setData({
                  fileCategories: res.data.fileCategories
                })
              }           
              wx.hideLoading();
            }else{
              wx.hideLoading();
              wx.showToast({
                title: res.data.message,
              })
              that.setData({
                isError: true
              })
            }
          }else{
            wx.hideLoading();
            wx.showToast({
              title: JSON.stringify(data),
            })    
            that.setData({
              isError: true
            })
          }
         
        },
        fail(error){
            wx.hideLoading();
            wx.showToast({
              title: JSON.stringify(error),
            })
        }
      })
  },
  previewImage(e){
    console.log(this.data.url)
    const current = e.target.dataset.src
    console.log(current)
    wx.previewImage({
      current,
      urls: this.data.url
    })
  }
})