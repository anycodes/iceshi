// pages/user/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_pic: "/image/others/user.png",
    user_name: "点击登录",
    user_local: "中国-广东-深圳",
    login_url: "/pages/login/index",
    login: false,
    userInfo: {},
    history: []
  },
  toIndex: function (e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        login: true,
        user_pic: app.globalData.userInfo.avatarUrl,
        user_name: app.globalData.userInfo.nickName,
        user_local: app.globalData.userInfo.country + "-" + app.globalData.userInfo.province + "-" + app.globalData.userInfo.city,
        login_url: ""
      })
      this.getHistory()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          login: true,
          user_pic: res.userInfo.avatarUrl,
          user_name: res.userInfo.nickName,
          user_local: res.userInfo.country + "-" + res.userInfo.province + "-" + res.userInfo.city,
          login_url: ""
        })
        this.getHistory()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            login: true,
            user_pic: res.userInfo.avatarUrl,
            user_name: res.userInfo.nickName,
            user_local: res.userInfo.country + "-" + res.userInfo.province + "-" + res.userInfo.city,
            login_url: ""
          })
          this.getHistory()
        }
      })
    }
  },
  getHistory: function(){
    var that = this
    wx.request({
      url: '您的后台url/get_history',
      data: {
        "wechat": app.globalData.openID,
      },
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      method: "POST",
      success: (res) => {
        that.setData({ history: res.data.result })
      }
    })
  },
  toRandom: function (e) {
    wx.request({
      url: '您的后台url/get_random',
      data: {
      },
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      method: "POST",
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/content/index?tid=' + res.data.result.tid,
        })
      },
      fail: (res) => {
        wx.navigateTo({
          url: '/pages/content/index?tid=0',
        })
      }
    })
  },
})