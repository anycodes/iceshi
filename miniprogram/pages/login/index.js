//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '授权登录',
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log("openID: ", app.globalData.openID)
    console.log("nickName: ", app.globalData.userInfo.nickName)
    wx.request({
      url: '您的后台url/login',
      data: {
        "wechat": app.globalData.openID,
        "nickname": app.globalData.userInfo.nickName,
        "remark": app.globalData.userInfo,
        "pic": app.globalData.userInfo.avatarUrl,
        "local": app.globalData.userInfo.country + "-" + app.globalData.userInfo.province + "-" + app.globalData.userInfo.city,
      },
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      method: "POST",
      success: (res) => {
        console.log("Success: ", res.data)
        if (res.data.result != true) {
          this.setData({
            userInfo: null,
            hasUserInfo: false
          })
        } else {
          console.log("result is true")
          this.setData({
            hasUserInfo: true
          })
          wx.redirectTo({
            url: '/pages/user/index',
          })
        }
      },
      fail: (res) => {
        console.log("Faild: ", res.data)
        this.setData({
          userInfo: null,
          hasUserInfo: false
        })
        wx.showToast({
          title: "注册/登录失败,请稍后再试",
        })
        wx.redirectTo({
          url: '/pages/user/index',
        })
      }
    })
  }
})
