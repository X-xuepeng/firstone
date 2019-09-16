Page({
  data: {
    'current_scroll': '',
    'rooms':[],
    isNull:false,
    isError:false
  },
  onLoad(e){
    wx.showLoading({
      title: '房间工艺',
      mask:true
    })
    let that=this;
    let projectID=wx.getStorageSync('projectID');
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Project/GetProjectRooms',
      data:{
        projectId:projectID
      },
      success(res){
      if(res.statusCode===200){
        if(res.data.code===0){
          if (res.data.rooms.length!==0){
          for (let room of res.data.rooms){
           room.width= room.name.length*20;
          }
          wx.hideLoading();
          that.setData({
            'current_scroll': res.data.rooms[0].id,
            'rooms':res.data.rooms,
          })
            that.getProcess(res.data.rooms[0].id)
          }else{
            //列表爲空
            wx.hideLoading();
            that.setData({
              isNull:true
            })
          }
        }else{
         wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          that.setData({
            isError: true
          })
        }
      }else{
        wx.hideLoading();
        wx.showToast({
          title: JSON.stringify(res.data),
          icon:'none'
        })
        that.setData({
          isError: true
        })
      }
      },
      fail(e){

      }
    })
  },
  handleChangeScroll({ detail }) {  
    this.setData({
      current_scroll: detail.key
    });
    this.getProcess(detail.key)
  },
  getProcess(id){
    let that=this;
    wx.showLoading({
      title: '获取工艺',
    })
    wx.request({
      url: 'https://pmapi.microfeel.net/api/Project/GetProjectRoomTechnologies',
      data:{
        'roomId':id
      },
      success(res){
        console.log(res)
        if (res.statusCode === 200) {
          wx.hideLoading();
          if (res.data.code === 0) {
            that.setData({
              p_Technologies: res.data.p_Technologies
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })     
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: JSON.stringify(res.data),
            icon: 'none'
          })
        }
      },
      fail(error){

      }
    })
  },
  click(e){
    let project=this.data.p_Technologies.find(function(project){
      return project.id===e.currentTarget.id
    })
    let technologyTitle = wx.setStorageSync('technologyTitle',project.name);
    wx.navigateTo({
      url: `../checker/checker?budgetId=${project.budgetId}`,
    })
  }
});