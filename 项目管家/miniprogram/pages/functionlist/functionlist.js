// miniprogram/pages/functionlist/functionlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    phoneNumber: '',
    projectID: '',
    projectAddress: '',
    acceptancePhase: -1,
    project_check: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取数据
    let projectAddress = options.projectAddress;
    this.data.openId = options.openId;
    this.data.phoneNumber = options.phoneNumber;
    this.data.projectAddress = options.projectAddress;
    this.data.projectID = options.projectID;
    this.data.acceptancePhase = options.acceptancePhase;
    wx.setNavigationBarTitle({
      title: projectAddress
    })
    this.returnCheckResult(this.data.acceptancePhase);
    wx.setStorageSync("refresh", true);
  },
  //进入送货单
  sendMaterial(e){
    wx.navigateTo({
      url:`../materiallist/materiallist?openId=${this.data.openId}`,
    })
  },
  //上传照片
  uploadPicture(e){
    switch (this.data.acceptancePhase) {
      case '0':
        wx.showToast({
          title: '项目经理未申请水电报检，请等待...',
          icon: 'none'
        })
        break;
      case '1':
        this.upload();
        break;
      case '2':
        wx.showToast({
          title: '水电报检单正在审核中，请等待...',
          icon: 'none'
        })
        break;
      case '3':
        wx.showToast({
          title: '项目经理未申请木瓦报检，请等待...',
          icon: 'none'
        })
        break;
      case '4':
        this.upload();
        break;
      case '5':
        wx.showToast({
          title: '木瓦报检单正在审核中，请等待...',
          icon: 'none'
        })
        break;
      case '6':
        wx.showToast({
          title: '项目经理未申请油整报检，请等待...',
          icon: 'none'
        })
        break;
      case '7':
        this.upload();
        break;
      case '8':
        wx.showToast({
          title: '油工报检单正在审核中，请等待...',
          icon: 'none'
        })
        break;
      case '9':
        wx.showToast({
          title: '审核已全部完毕...',
          icon: 'none'
        })
        break;
    }
  },
  //跳转到上传图片
  upload(){
    wx.navigateTo({
      url: `../uploadpicture/uploadpicture?projectID=${this.data.projectID}&projectAddress=${this.data.projectAddress}&status=${this.data.acceptancePhase}&openId=${this.data.openId}&phoneNumber=${this.data.phoneNumber}`,
    })
  },
  //根据状态返回报检程度
  returnCheckResult(status) {
    console.log(status)
    let check_status = "";
    switch (status) {
      case '0':
        check_status = "水电报检未申请";
        break;
      case '1':
        check_status = "上传水电报检单";
        break;
      case '2':
        check_status = "水电报检审核中"
        break;
      case '3':
        check_status = "木瓦报检未申请";
        break;
      case '4':
        check_status = "上传木瓦报检单";
        break;
      case '5':
        check_status = "木瓦报检审核中"
        break;
      case '6':
        check_status = "油整报检未申请";
        break;
      case '7':
        check_status = "上传油整报检单";
        break;
      case '8':
        check_status = "油工报检审核中"
        break;
      case '9':
        check_status = "审核完毕"
        break;
    }

    this.setData({
      project_check: check_status
    })
  }

})