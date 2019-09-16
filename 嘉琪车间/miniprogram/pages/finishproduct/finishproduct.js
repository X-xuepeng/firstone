// miniprogram/pages/finishproduct/finishproduct.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      openId:'',
      companyId:'',
      id:'',
      checkData:[],
      totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.openId = options.openId;
    this.data.id = options.id;
    this.data.companyId = options.companyId;
    this.data.BillNO = options.BillNO;
    this.data.status = options.status;
    wx.setNavigationBarTitle({
      title: options.BillNO+'(成品入库)',
    })
    wx.showLoading({
      title: '获取成品数据',
      mask:true
    })
    let that=this;
    wx.request({
      url: 'https://api.gopas.com.cn/api/WorkShop/GetProducts',
      method:'get',
      data:{
        openid: this.data.openId,
        companyid: this.data.companyId,
        billno:this.data.BillNO
      },
      success(res){
        wx.hideLoading();
        if(res.statusCode===200){
          if(res.data.Code===200){
            if (res.data.Datas.length !== 0) {
              for (let data of res.data.Datas) {
                data.checked = false;
                data.showCount = data.Numbers;
              }
              that.setData({
                Datas: res.data.Datas
              })
            } else {
              that.list_empty();
            }
          } else {
            that.net_error();
          }
        } else {
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
  },
  //单选
  onClickChange(e) {
    let allCheck = true;
    let item = this.data.Datas.filter(function (item) {
      return item.Code === e.target.id
    })
    item[0].checked = !item[0].checked;
    for (let data of this.data.Datas) {
      if (!data.checked) {
        allCheck = false;
        break;
      }
    }
    this.setData({
      checked: allCheck,
      Datas: this.data.Datas
    })
    this.computeCount();
  },
  //全选
  onChange(e) {
    for (let data of this.data.Datas) {
      data.checked = !this.data.checked;
    }
    this.setData({
      checked: !this.data.checked,
      Datas: this.data.Datas,
    })
    this.computeCount();
  },
  //查看选中的数量
  computeCount() {
    let totalCount = 0;
    for (let data of this.data.Datas) {
      if (data.checked) {
        totalCount += data.showCount;
      }
      this.setData({
        totalCount: totalCount
      })
    }
  },
  //更改数量
  changeCount(e) {
    this.data.currentClick = e.currentTarget.id;
    this.setData({
      showModal: true
    })
  },/**
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
  },  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    let that = this;
    let clickItem = this.data.Datas.filter(function (item) {
      return item.Code === that.data.currentClick;
    })
    if (this.data.materialCount === "") {
      wx.showToast({
        title: '请输入入库数量',
        icon: 'none'
      })
      return
    }
    if (parseFloat(this.data.materialCount).toString() === "NaN") {
      wx.showToast({
        title: '请输入数字',
        icon: 'none'
      })
      return
    }
    if (this.data.materialCount > clickItem[0].Numbers) {
      wx.showToast({
        title: '已超过允许领的最大值' + clickItem[0].Numbers,
        icon: 'none'
      })
      return
    }
    clickItem[0].showCount = parseFloat(this.data.materialCount);
    this.setData({
      Datas: this.data.Datas
    })
    this.computeCount();
    this.data.materialCount = ""
  },
  inputChange: function (e) { //更改数量
    this.data.materialCount = e.detail.value;
  },
  //检查选中了哪些数据
  check: function () {
    this.data.checkData=[]
    for (let data of this.data.Datas) {
      if (data.checked) {
        this.data.checkData.push(data);
      }
    }

  },
  //退料
  onClickButton: function (e) {
    this.check();
    let that = this;
    if (this.data.checkData.length === 0) {
      wx.showToast({
        title: '请选择入库材料',
        icon: 'none'
      })
      return
    }
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '请保证入库数量大于0',
        icon: 'none'
      })
      return
    }
    let wxStoreApplyEntry = [];
    for (let material of this.data.checkData) {
      let entry = {};
      entry.fnumber = material.Code;
      entry.numbers = material.showCount;
      wxStoreApplyEntry.push(entry);
    }
    wx.showLoading({
      title: '入库中',
      mask: true
    })
    wx.request({
      url: 'https://api.gopas.com.cn/api/WorkShop/ProductStroreApply',
      method: 'post',
      data: {
        OpenId: that.data.openId,
        CompanyId: that.data.companyId,
        SourceBillNo: that.data.BillNO,
        WxStoreApplyEntry: wxStoreApplyEntry
      },
      success(res) {
        
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (res.data.Code === 200) {
            wx.showModal({
              content: '入库成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            });
          } else {
            console.info({
              OpenId: that.data.openId,
              CompanyId: that.data.companyId,
              SourceBillNo: that.data.BillNO,
              SourceId: that.data.id,
              WxStoreApplyEntry: wxStoreApplyEntry
            });
            wx.showToast({
              title: '入库失败' + JSON.stringify(res),
            })
          }
        } else {
          wx.showToast({
            title: '入库失败' + JSON.stringify(res),
          })
        }
      }
    })
  }
})