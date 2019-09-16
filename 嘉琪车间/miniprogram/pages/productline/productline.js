import Dialog from '../../dist/dialog/dialog';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    access_token:'',
    machines:[],
    Remark:"",
    inputContent:"",
    updateId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  onShow:function(){
    let access_token = wx.getStorageSync('access_token');
    this.data.access_token=access_token;
    let update=wx.getStorageSync('update');
    if (update===""){
      let that=this;
      wx.showLoading({
        title: '获取生产线',
        icon:'none'
      })
    
      wx.request({
        header: {
          "Authorization": `Bearer ${access_token}`,
        },
        url: 'https://workshopapi.gopas.com.cn/api/Machine',
        method: "GET",
        data: {
          index: "1",
          size: "1000"
        },
        success(res) {
          console.log(res);
          wx.hideLoading();
          if (res.statusCode === 401) { //token过期
            wx.reLaunch({
              url: `../authentication/authentication`
            });
            wx.setStorageSync('access_token', '');
          } else if (res.statusCode === 200) {
            if (res.data.Code === 200) {            
            that.setData({
              machines:res.data.Datas
            });
            } else {
              wx.showToast({
                title: '查询失败' + JSON.stringify(res),
                icon: "none"
              })
            }
          } else {
            wx.showToast({
              title: '查询失败' + JSON.stringify(res),
              icon: "none"
            })
          }
        }
      })
    }
   
  },
  createProductLine(e){
    wx.scanCode({
      scanType: ['qrCode'],
      success(res){
          wx.navigateTo({
            url: `../productdetail/productdetail?ip=${res.result}`,
          })
      }	
    })
  },
  //更新生产线
  updateProductLine(e){
    let that = this;
    let machine = this.data.machines.find(item => {
      return item.Id == e.currentTarget.id
    });
    this.data.Remark = machine.Remark;
    this.data.updateId=machine.Id;
    this.setData({
      inputContent: machine.Remark
    })
    this.setData({
      showModal: true
    })
  },
  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
    this.hideModal();
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function (e) {
    if (this.data.inputContent === this.data.Remark){
      wx.showToast({
        title: '请更新内容再提交',
        icon:"none"
      })
      return;
    }
    let that=this;
    this.hideModal();
    wx.showLoading({
      title: '更新中'
    })
    wx.request({
      url: `https://workshopapi.gopas.com.cn/api/Machine/${that.data.updateId}`,
      header: {
        "Authorization": `Bearer ${that.data.access_token}`,
      },
      method:"PUT",
      data:{
        remark:that.data.inputContent
      },
      success(res){
        wx.hideLoading();
        if(res.statusCode===200){
          if(res.data.Code===200){
              that.onShow();
          }else{
            wx.showToast({
              title: JSON.stringify(res),
              icon:"none"
            })
          }
        }else{  
        wx.showToast({
          title: JSON.stringify(res),
          icon: "none"
        })
        } 
      }
    })
  },

  //删除生产线
  deleteProductLine(e){
    let that=this;
   let machine=this.data.machines.find((item)=>item.Id==e.currentTarget.id);
    Dialog.alert({
      message: `确定删除${machine.MachineName}吗?`
    }).then(() => {
      wx.showLoading({
        title: '删除中'
      })
      wx.request({
        url: `https://workshopapi.gopas.com.cn/api/Machine/${machine.Id}`,
        header: {
          "Authorization": `Bearer ${that.data.access_token}`,
        },
        method:'DELETE',
        success(res){
          wx.hideLoading();
          if(res.statusCode===200){
            if(res.data.Code===200){
              wx.showToast({
                title: '删除成功',
                icon:'none'
              })
              that.onShow();
            }else{
              wx.showToast({
                title: '删除失败'+JSON.stringify(res),
                icon: 'none'
              })
            }
          }else{
            wx.showToast({
              title: '删除失败' + JSON.stringify(res),
              icon: 'none'
            })
          }
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  inputChange: function (e) {
    this.setData({
       inputContent:e.detail.value
    }) 
  }
})