// pages/tasks/index/index.js
import _ from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    currStatus: 'Doing',
    status: [
      {value: 'Doing', label: '待完成'}, 
      {value: 'Finished', label: '已完成'},
      {value: 'Expired', label: '已过期'}
    ]
  },

  chooseStatus: function (event) {
    this.setData({
      currStatus: event.currentTarget.dataset.status
    })
    // 将点击的数据保存在currStatus中，显示当前的页面情况
    this.loadTask();
  },

  goToDetail: function (event) {
    console.log(event)
    let id = event.currentTarget.dataset.id
    // 当处于待完成的阶段时，那么此时可以进行相应的跳转操作
    if (this.data.currStatus === 'Doing') {
      wx.navigateTo({
        url: '/pages/tasks/detail/detail?id=' + id,
      })
    }
    // 跳转至detail页面，把id的值传过去
  },

  loadTask: function () {
    console.log("task界面显示任务链接")
    //调用函数function myGet(url, data, success = () => { }, errorHandler = defaultErrorHandler, ignore = false) {
    _.get('cstask/acceptedTask/list', {
      status:this.data.currStatus
      //前面是获得数据。选择的是状态，根据状态来选择显示的内容
    }, res => {
      console.log("cstask1"+res)
      console.log("cstask"+res.data)
      res.data = res.data.map(val => {
        let time = new Date(val.createTime)
        val.createTimeStr = _.formatTime(time)
        return val
      })
      this.setData({
        taskList: res.data
      }),
      console.log(res.data[0])
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      currStatus: "Doing"
    })
    this.loadTask()
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