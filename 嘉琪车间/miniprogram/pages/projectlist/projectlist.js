// miniprogram/pages/projectlist/projectlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    Datas: [],
    isError: false,
    isNull: false,
    searchValue: "",
    searchList: [],
    isShow: "",
    emptyShow: "hide",
    openId: "",
    Total: 0,
    index: 1,
    maxCount: 0,
    canPull:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let openId = options.openId;
    this.data.openId = openId;
    wx.setStorageSync("isNeedFlesh", false);
  },
  onShow: function() {
    let isNeedFlesh = wx.getStorageSync("isNeedFlesh");
    if (!isNeedFlesh) {
      this.getPPbom(this.data.index);
    }
    wx.setStorageSync("isNeedFlesh", true);
  },
  //获取投料单
  getPPbom(index) {
    this.data.canPull=true;
    let that = this;
    wx.showLoading({
      title: '获取投料单',
      mask: true
    })

    wx.request({
      method: 'get',
      url: 'https://api.gopas.com.cn/api/WorkShop/PPBom',
      data: {
        openid: that.data.openId,
        index: index,
        pagesize: 20
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          if (res.data.Code === 200) {
            if (res.data.Datas.length !== 0) {
              for (let item of res.data.Datas) {
                item.CreateDate = item.CreateDate.substring(0, 10);
                if (item.ApplyState) {
                  item.status = "已领料"
                  item.color = "#5cb85c"
                } else {
                  item.status = "未领料"
                  item.color = "#d9534f"
                }
              }
              let newArray = that.data.searchList.concat(res.data.Datas);
              let maxCount = Math.ceil(res.data.Total / 20);
              that.setData({
                searchList: newArray,
                Total: res.data.Total,
                maxCount: maxCount
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

      },
      fail: function(res) {
        console.log(res)
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
  onSearch: function(event) {
    let that = this;
    if (this.data.value === this.data.searchValue) {
      wx.showToast({
        title: '两次不可搜索同样的关键词',
        icon: 'none'
      })
      return
    }
    this.data.searchValue = this.data.value;
    wx.showLoading({
      title: '获取投料单',
      mask: true
    })
    if (this.data.searchValue !== "") {
      wx.request({
        method: 'get',
        url: 'https://api.gopas.com.cn/api/WorkShop/PPBom',
        data: {
          openid: that.data.openId,
          key: that.data.searchValue,
          index: 1,
          pagesize: 1000
        },
        success: function(res) {
         that.data.canPull=false; 
          wx.hideLoading();
          if (res.statusCode === 200) {
            if (res.data.Code === 200) {
              if (res.data.Datas.length !== 0) {
                for (let item of res.data.Datas) {
                  item.CreateDate = item.CreateDate.substring(0, 10);
                  if (item.ApplyState) {
                    item.status = "已领料"
                    item.color = "#5cb85c"
                  } else {
                    item.status = "未领料"
                    item.color = "#d9534f"
                  }
                }
                let newArray = res.data.Datas;


                that.setData({
                  searchList: newArray,
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

        },
        fail: function(res) {
          console.log(res)
        }
      });
    } else {
      this.data.index = 1;
      this.data.searchValue = [];
      this.getPPbom(this.data.index);
    }
  },
  searchChange: function(event) {
    this.data.value = event.detail;
  },
  //跳转下个页面
  projectDetail(event) {
    let clickList = this.data.searchList.filter(function(clickItem) {
      return clickItem.BillNO=== event.currentTarget.id
    })
    wx.navigateTo({
      url: `../functionlist/functionlist?openId=${this.data.openId}&companyId=${clickList[0].CompanyID}&BillNO=${clickList[0].BillNO}&status=${clickList[0].ApplyState}&AllowReturnAndStore=${clickList[0].AllowReturnAndStore}`,
    })

  },
  // 页面上拉触底事件（上拉加载更多）
  onReachBottom: function() {
    if(this.data.canPull){
      this.data.index = this.data.index + 1;
      if (this.data.index > this.data.maxCount) {
        return;
      }
      this.getPPbom(this.data.index);
    }
  },

})