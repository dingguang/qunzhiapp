// pages/market/index/index.js
import _ from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    currStatus: 'Recommend',
    status: [
      { value: 'Recommend', label: '推荐任务' },
      { value: 'All', label: '全部任务' },
    ]
  },

  goToDetail: function (event) {
    _.D(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/market/detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  chooseStatus: function (event) {
    this.setData({
      currStatus: event.currentTarget.dataset.status
    })
    this.loadTask()
  },
  goToFilter: function () {
    wx.navigateTo({
      url: '/pages/market/filter/filter',
    })
  },

  loadTask: function () {
    if (this.data.currStatus === 'All') {
      _.get('cstask/task/list', {}, res => {
        res.data = res.data.map(val => {
          val.createTimeStr = _.formatTime(new Date(val.createTime))
          return val
        })
        this.setData({
          taskList: res.data
        })
      })
    } else if (this.data.currStatus === 'Recommend') {
      _.get('/cstask/recommendTask/list', {}, res => {
        res.data = res.data.map(val => {
          console.log("csmarket")
          val.createTimeStr = _.formatTime(new Date(val.createTime))
          return val
        })
        this.setData({
          taskList: res.data
        })
      })
    }
  },

  init: function () {
    this.loadTask()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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