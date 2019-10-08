// pages/result/index.js
var WxParse = require('../../dependence/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_title: "测试结果",
    tid: 0,
    rid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: this.data.page_title,
    })
    that.setData({
      tid: options['tid'],
      rid: options['rid']
    })

    wx.request({
      url: '您的后台url/get_result_content',
      data: {
        result: options['rid'],
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      success: function (res) {
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        console.log(res.data.result.content)
        WxParse.wxParse('insertData', 'html', res.data.result.content, that);
      },
      fail: function (res) {
        wx.showToast({
          title: '获取结果失败，请稍后再试',
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },

  toUser: function (e) {
    wx.redirectTo({
      url: '/pages/user/index',
    })
  },

  toIndex: function (e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  buttonClick: function (e) {
    console.log("click")
    wx.redirectTo({
      url: '/pages/content/index?tid=' + this.data.tid,
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