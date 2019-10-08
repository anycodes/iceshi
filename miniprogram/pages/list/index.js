// pages/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_data: true, 
    category: {
      'fire': "热门",
      'heart': "情感",
      'cross': "性格",
      'health': "健康",
      'work': "职场",
      'group': "人际",
      'do': "能力",
      'family': "亲子",
      'others': "其他",
    },
    content: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var page_type = options['type']
    wx.setNavigationBarTitle({
      title: this.data.category[page_type] //修改title
    })
    wx.request({
      url: '您的后台url/get_list',
      data: {
        category: page_type,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-json"
      },
      success: function (res) {
        that.setData({ content: res.data.result });
        console.log("result len: ", res.data.result.length)
        console.log("result: ", res.data.result)
        if (res.data.result.length==0){
          that.setData({ has_data: false });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取列表失败',
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
})