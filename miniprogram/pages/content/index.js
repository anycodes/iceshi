// pages/content/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_title: "测试",
    button_content: "提交测试",
    button_disabled: false,
    tid: 0,
    question: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: this.data.page_title,
    })
    that.setData({
      tid: options['tid']
    })
    wx.request({
      url: '您的后台url/get_question',
      data: {
        test: options['tid'],
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      success: function (res) {
        that.setData({ question: res.data.result });
        console.log("result len: ", res.data.result.length)
        console.log("result: ", res.data.result)
      },
      fail: function (res) {
        wx.showToast({
          title: '获取测试题失败',
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },

  radioChange: function(e) {
    console.log(e.detail.value)
    var that = this
    var question = this.data.question;
    var selection_list = e.detail.value.split("-")
    var change_quesetion = question[parseInt(selection_list[0])]
    console.log(change_quesetion)
    for (var j = 0, len = change_quesetion['selection'].length; j < len; ++j) {
      change_quesetion['selection'][j].checked = change_quesetion['selection'][j].value == selection_list[1];
    }
    question[parseInt(selection_list[0])] = change_quesetion
    that.setData({
      question: question
    });
  },

  buttonClick: function(e){
    console.log("click")
    var that = this
    that.setData({
      button_disabled: true,
      button_content: "已经提交，请等待"
    })
    var sum = 0
    var question = this.data.question
    for (var j = 0, arr_len = question.length; j < arr_len; ++j) {
      for (var i = 0, len = question[j]['selection'].length; i < len; ++i) {
        if (question[j]['selection'][i].checked ){
          sum = sum + question[j]['selection'][i].score
          console.log(sum)
        }
      }
    }
    
    var tid = this.data.tid
    wx.request({
      url: '您的后台url/get_result',
      data: {
        test: tid,
        score: sum,
        user: app.globalData.openID,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      success: function (res) {
        console.log(res)
        wx.redirectTo({
          url: '/pages/result/index?tid=' + tid + '&rid=' + res.data.result.rid,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取测试结果失败，请稍后再试',
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
})