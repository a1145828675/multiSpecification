// pages/others/lefttab/lefttab.js
var app = getApp()
Page({
  data: {
    activeIndex: 0,    
    categories: [],
    goods: [],
    searchInput: '',
    activeCategoryId: 0,
  },
  changeTab: function (e) {
    // console.log(e)
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      content: e.currentTarget.dataset.name,
      activeCategoryId: e.currentTarget.id
    })

    this.getGoodsList(this.data.activeCategoryId);
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var vm = this;
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        vm.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        // console.log(res)
        var categories = [{ id: 0, name: "全部" }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.getGoodsList(0);
      }
    })
  },
  getGoodsList: function (categoryId) {
    // console.log(categoryId)
    if (categoryId == 0) {
      categoryId = "";
    }
    // console.log(categoryId)
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: categoryId,
        nameLike: that.data.searchInput
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})