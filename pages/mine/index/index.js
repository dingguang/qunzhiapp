// pages/mine/index/index.js
import _ from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  init: function () {
    _.get('csuser/current', {}, res => {
      this.setData({
        doingCount: res.data.doingTaskCount,
        finishCount: res.data.finishTaskCount,
        user: res.data.csUser
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  goToInfo: function () {
    wx.navigateTo({
      url: '/pages/mine/user-info/user-info',
    })
  },
  goToInfo1: function () {
    wx.navigateTo({
      url: '/pages/mine/login/login',
    })
  },
  goToInfo2: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})