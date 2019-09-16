// miniprogram/pages/picking/picking.js
Page({
  /**
     * 页面的初始数据
     */
  data: {
    Datas: [],
    openId: "",
    id: "",
    buttonStatus: "primary",
    status: false,
    checked: false,
    showModal: false,
    materialCount: '',
    currentClick: '',
    totalCount: 0,
    checkData: [],
    companyId: '',
    BillNO: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: options.BillNO + '(领料)',
    })
    wx.showLoading({
      title: '获取投料单明细',
      mask: true
    })
    this.data.openId = options.openId;
    this.data.id = options.id;
    this.data.companyId = options.companyId;
    this.data.BillNO = options.BillNO;
    this.data.status = options.status;
    // if (options.status === "true") {
    //   this.setData({
    //     buttonStatus: "danger"
    //   })
    // } else {
    //   this.setData({
    //     buttonStatus: "primary"
    //   })
    // }
    wx.request({
      method: 'get',
      url: 'https://api.gopas.com.cn/api/WorkShop/PPBomEntry',
      data: {
        openid: options.openId,
        companyid: options.companyId,
        billno: options.BillNO
      },
      success(res) {
        console.log(res)
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (res.data.Code === 200) {
            if (res.data.Datas.length !== 0) {
              for (let data of res.data.Datas) {
                data.checked = false;
                data.showCount = data.AllowKeepNumbers;
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
      return ""+item.ID === e.target.id
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
      return ""+item.ID === that.data.currentClick;
    })
    if (this.data.materialCount === "") {
      wx.showToast({
        title: '请输入领料数量',
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
    if (this.data.materialCount > clickItem[0].AllowKeepNumbers) {
      wx.showToast({
        title: '已超过允许领的最大值' + clickItem[0].AllowKeepNumbers,
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
    this.data.checkData = []
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
        title: '请选择提料材料',
        icon: 'none'
      })
      return
    }
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '请保证领货数量大于0',
        icon: 'none'
      })
      return
    }
    let wxStoreApplyEntry = [];
    for (let material of this.data.checkData) {
      let entry = {};
      entry.entryId = material.EntryID;
      entry.fnumber = material.Code;
      entry.numbers = material.showCount;
      wxStoreApplyEntry.push(entry);
    }
    let date = new Date().toLocaleDateString();
    wx.showLoading({
      title: '提料中',
      mask: true
    })
    console.log(JSON.stringify({
      openId: that.data.openId,
      companyId: parseInt(that.data.companyId),
      sourceBillNo: that.data.BillNO,
      wxStoreApplyEntry: wxStoreApplyEntry,
      applyType: "领料申请",
      applyDate: date,
      applierId: 0,
      state:1
    }))
    wx.request({
      url: 'https://api.gopas.com.cn/api/WorkShop/ApplyPPBoms',
      method: 'post',
      data: {
        openId: that.data.openId,
        companyId: parseInt(that.data.companyId),
        sourceBillNo: that.data.BillNO,
        wxStoreApplyEntry: wxStoreApplyEntry,
        applyType: "领料申请",
        applyDate: date,
        applierId: 0,
        state: 1  
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (res.data.Code === 200) {
            wx.showModal({
              content: '领料成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.setStorageSync("isNeedFlesh", true);
                  wx.navigateBack({
                    delta: 2
                  })
                }
              }
            });
          } else {
            wx.showToast({
              title: '领料失败' + JSON.stringify(res),
            })
          }
        } else {
          wx.showToast({
            title: '领料失败' + JSON.stringify(res),
          })
        }
      }
    })
  }
})