// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot_test: [],
    content: [],
    category: [
      {
        'title': "热门",
        'src': "/image/category/fire.png",
        'url': "/pages/list/index?type=fire"
      },
      {
        'title': "情感",
        'src': "/image/category/heart.png",
        'url': "/pages/list/index?type=heart"
      },
      {
        'title': "性格",
        'src': "/image/category/cross.png",
        'url': "/pages/list/index?type=cross"
      },
      {
        'title': "健康",
        'src': "/image/category/health.png",
        'url': "/pages/list/index?type=health"
      },
      {
        'title': "职场",
        'src': "/image/category/work.png",
        'url': "/pages/list/index?type=work"
      },
      {
        'title': "人际",
        'src': "/image/category/group.png",
        'url': "/pages/list/index?type=group"
      },
      {
        'title': "能力",
        'src': "/image/category/do.png",
        'url': "/pages/list/index?type=do"
      },
      {
        'title': "亲子",
        'src': "/image/category/family.png",
        'url': "/pages/list/index?type=family"
      },
      {
        'title': "其他",
        'src': "/image/category/detail.png",
        'url': "/pages/list/index?type=others"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '爱测试'  //修改title
    })
    wx.request({
      url: '您的后台url/get_index',
      data: {
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      success: function (res) {
        that.setData({ hot_test: res.data.result });
        console.log("result len: ", res.data.result.length)
        console.log("result: ", res.data.result)
      }
    })
    wx.request({
      url: '您的后台url/get_list',
      data: {
        category: "fire",
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      success: function (res) {
        that.setData({ content: res.data.result });
        console.log("result len: ", res.data.result.length)
        console.log("result: ", res.data.result)
        if (res.data.result.length == 0) {
          that.setData({ has_data: false });
        }
      },
    })
  },

  hotClick: function (e) {
    wx.navigateTo({
      url: '/pages/content/index?tid=' + e.currentTarget.dataset.tid,
    })
  },

  toUser: function(e){
    wx.redirectTo({
      url: '/pages/user/index',
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