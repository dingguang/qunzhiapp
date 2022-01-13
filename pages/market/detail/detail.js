// pages/market/detail/detail.js
import _ from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    task: {}
  },

  goToFinish: function () {
    _.post('cstask/task/accept', {
      taskId: this.data.taskId
    }, {}, res => {
      wx.switchTab({
        url: '/pages/tasks/index/index',
      })
    })
  },

  init: function () {
    console.log("test")
    console.log(this.data.taskId)
    console.log("tasked id")
    _.get('cstask/task/detail', {
      csTaskId: this.data.taskId
    }, res => {
      res.data.createTimeStr = _.formatTime(new Date(res.data.csTask.createTime))
      this.setData({
        task: res.data.csTask,
        questions: res.data.csQuestions
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      taskId: options.id
    })
    console.log("id")
    console.log(options.id)
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