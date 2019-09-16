const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
//index.js
var app = getApp()
Page({
  data: {
    showModal: false,
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      totalScoreToPay: 0,
      allSelect: true,
      noSelect: false,
      list: [],
      shoplist:[]
    },
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function() {
    this.initEleWidth();
    this.requestData();
  },
  requestData: function() {
    var that = this;
    let projectID = wx.getStorageSync('projectID');
    wx.request({
      url: 'https://pmapi.microfeel.net/api/ShoppingCart/getproducts',
      data: {
        projectId: projectID
      },
      success: function(res) {
        console.log(res);
        that.data.goodsList.list = res.data.shoppingCarts;
        that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), res.data.shoppingCarts);
      },
      fail: function(error) {
        wx.showToast({
          title: JSON.stringify(error),
          icon: 'none'
        })
      }
    })

  },
  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    var index = e.currentTarget.dataset.index;

    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },

  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  //删除
  delItem: function(e) {
    // var index = e.currentTarget.dataset.index;
    // var list = this.data.goodsList.list;
    // list.splice(index, 1);
    // this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  selectTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
  },
  totalPrice: function() {
    var list = this.data.goodsList.list;
    var total = 0;
    let totalScoreToPay = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.unitPrice) * curItem.quantity;
      }
    }
    this.data.goodsList.totalScoreToPay = totalScoreToPay;
    total = parseFloat(total.toFixed(2)); //js浮点计算bug，取两位小数精度
    return total;
  },
  allSelect: function() {
    var list = this.data.goodsList.list;
    var allSelect = false;    
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function() {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function(saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list,
        totalScoreToPay: this.data.goodsList.totalScoreToPay
      }
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].number
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },
  bindAllSelect: function() {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },
  jiaBtnTap: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.goodsList.list;
    if (index !== "" && index != null) {
      // 添加判断当前商品购买数量是否超过当前商品可购买库存
      var carShopBean = list[parseInt(index)];
      var carShopBeanStores = 0;
      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
        data: {
          id: carShopBean.goodsId
        },
        success: function(res) {
          carShopBeanStores = res.data.data.basicInfo.stores;
          console.log(' currnet good id and stores is :', carShopBean.goodsId, carShopBeanStores)
          if (list[parseInt(index)].number < carShopBeanStores) {
            list[parseInt(index)].number++;
            that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
          }
          that.setData({
            curTouchGoodStore: carShopBeanStores
          })
        }
      })
    }
  },
  jianBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  editTap: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  saveTap: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  getSaveHide: function() {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  deleteSelected: function() {
    let that=this;
    var list = this.data.goodsList.list;
    list = list.filter(function(curGoods) {
      return curGoods.active;
    });
    if(list.length===0){
      return;
    }
    let projectID=wx.getStorageSync('projectID');   
    let deleteItem=[];
    for(let i=0;i<list.length;i++){
      deleteItem.push(list[i].resourceID);
    }
    wx.showLoading({
      title: '删除中',
      mask:true
    })
    wx.request({
      method:'post',
      url: 'https://pmapi.microfeel.net/api/ShoppingCart/delete',
      data:{
        projectId:projectID,
        resourceIds:deleteItem
      },
      success:function(res){
        wx.hideLoading();
        if(res.data.code===0){
          list = res.data.shoppingCarts;
          for(let i=0;i<list.length;i++){
            list[i].active=false;
          }
          that.data.goodsList.list=list;
          that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
        }else{
          wx.showToast({
            title: JSON.stringify(res),
            icon: 'none'
          })
        }
        
      },
      fail:function(res){
        wx.hideLoading();
        wx.showToast({
          title: JSON.stringify(res),
          icon:'none'
        })
      }
    })
  
  },
  // 提交订单
  toPayOrder: function(e) {
    let projectID= wx.getStorageSync('projectID');
    let openId= wx.getStorageSync('openId');
    var list = this.data.goodsList.list;
    list = list.filter(function (curGoods) {
      return curGoods.active;
    });
    if (list.length === 0) {
      return;
    }
    // e.detail.value;
    wx.request({
      method:'POST',
      url: 'https://dingtalk.microfeel.net:12401/api/Manager/BaseMaterial',
      data:{
        "Details":list,
        "ProjectID": projectID,
        "OpenID": openId,
        "BillDate": e.detail.value,
      
      },
      success(res){
        console.log(res)
      }
    })
  },
  //更改数量
  changeCount: function(e) {
    app.globalData.currentGoodID = e.currentTarget.id;
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {
    this.hideModal();
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false,
      showPhone: false,
      changePhone: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  onConfirm: function(e) {
    if (app.globalData.changeCount === undefined) {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      })
      return;
    } else if (app.globalData.changeCount.length === 0) {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      })
      return;
    } else if (typeof(app.globalData.changeCount) === Number) {
      wx.showToast({
        title: '请输入数字',
        icon: 'none'
      })
    } else {
      let that=this;
      let projectID = wx.getStorageSync('projectID');
      this.hideModal();
      wx.showLoading({
        title: '更改中',
        mask: true
      })
      wx.request({
        method: 'post',
        url: 'https://pmapi.microfeel.net//api/ShoppingCart/change',
        data: {
          "projectID": projectID,
          "resourceID": app.globalData.currentGoodID,
          "quantity": app.globalData.changeCount
        },
        success:function(res){
          if(res.data.code===0){      
            wx.hideLoading();
            let list = res.data.shoppingCarts; 
            for(let i=0;i<list.length;i++){
              for (let j = 0; j < that.data.goodsList.list.length;j++){
                if (list[i].resourceID === that.data.goodsList.list[j].resourceID){
                  console.log('进来了')
                  list[i].active=that.data.goodsList.list[j].active
                }
              }
            }
            that.data.goodsList.list=list;
            that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
          }else{
            wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
        },
        fail:function(error){
          console.log('失败'+error);
          wx.hideLoading();
          wx.showToast({
            title: JSON.stringify(error),
            icon: 'none'
          })
        }
      })
    }
  },
  inputChange: function(e) {
    app.globalData.changeCount = e.detail.value;
  }
})