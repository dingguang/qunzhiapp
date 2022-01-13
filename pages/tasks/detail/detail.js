// pages/tasks/detail/detail.js
import _ from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    utId: 0,
    csTask: {},
    csUserTask: {},
    csQuestions: [],
    response: [],
    currQ: {},
    id2res: {},
    displayQuestions: [],
    id2display: {},
    allDisplay: false,
    questionStep: []
  },


  // submit: function () {
  //     wx.showToast({
  //       title: '任务已完成',
  //     })
  //     _.post('cstask/task/accept', {
  //       taskId: this.data.csTask.id
  //     }, {}, res => {
  //       wx.switchTab({
  //         url: '/pages/tasks/index/index',
  //       })
  //     })
  // },
  submit: function () {
    _.D(this.data.id2res)
    _.D(this.data.response)
    _.D(this.data.questions)
    let response = []
    let notFinish = false
    console.log(this.data.csQuestions)
    console.log('输出的时候少了些内容，包括state')
    for (let i in this.data.csQuestions) {
      console.log(this.data.csQuestions[i].id)
      let id = this.data.csQuestions[i].id
      if (this.data.csQuestions[i].questionType === 'JUDGE') {
        if (this.data.id2res[id] === undefined) {
          this.data.csQuestions[i].questionType = 'NOTFINISH'
          this.data.id2res[id] = ''
        }
      } else {
        if (!this.data.id2res[id]) {
          this.data.id2res[id] = ''
        }
      }
      response.push({
        type: this.data.csQuestions[i].questionType,
        res: this.data.id2res[id]
      })
    }
    _.D(response)
    console.log(this.data.utId-1)
    //获得题目的类型与res的类型
    if (!notFinish) {
      console.log("进入新的")
      // _.post('cstask/userTask/finish', 
      _.post('cstask/userTask/finish', {
        utId: this.data.utId-1,
        // response: response
        response: JSON.stringify(response)
      }, {}, res => {
        wx.switchTab({
          url: '/pages/tasks/index/index',
        })
        wx.showToast({
          title: '任务已完成',
        })
      })
    } else {
      wx.showToast({
        title: '请完成所有题目',
        icon: 'none'
      })
    }
  },

  goToLast: function () {
    let len = this.data.questionStep.length
    console.log(len)
    if (len <= 1) {
      wx.showToast({
        title: '已是第一道题目',
        icon: 'none'
      })
      return
    } else {
      let last = this.data.questionStep[len - 2]
      for (let i of this.data.displayQuestions) {
        this.data.id2display[i.id] = false
        delete this.data.id2res[i.id]
      }
      let questionStep = this.data.questionStep.slice(0, len - 1)
      this.setData({
        displayQuestions: last,
        questionStep: questionStep,
        id2res: this.data.id2res
      })
    }
  },

  goToNext: function () {
    // 利用已经完成的题目，判断哪些题目可以用于展示
    // 检查当前页面的题目，是否都已完成
    let displayQuestions = []
    for (let i of this.data.displayQuestions) {
      if (i.questionType === 'JUDGE' && this.data.id2res[i.id] === undefined) {
        wx.showToast({
          title: '请完成所有题目',
          icon: 'none'
        })
        return
      }
    }
    let allDisplay = true
    for (let i of this.data.csQuestions) {
      if (!this.data.id2display[i.id]) {
        // 判断条件是否满足
        let flag = true
        for (let j of i.conditions) {
          if (this.data.id2res[j.questionId] !== j.flag) {
            flag = false
            break
          }
        }
        if (flag) {
          displayQuestions.push(i)
          this.data.id2display[i.id] = true
        }
      }
      if (!this.data.id2display[i.id]) {
        allDisplay = false
      }
    }
    if (displayQuestions.length === 0) {
      allDisplay = true
    }
    this.data.questionStep.push(displayQuestions)
    this.setData({
      id2display: this.data.id2display,
      displayQuestions: displayQuestions,
      allDisplay: allDisplay,
      questionStep: this.data.questionStep,
    })
  },

  loadUserTask: function () {
    _.get('cstask/userTask/detail', {
      utId: this.data.utId
    }, res => {
      res.data.expireTimeStr = _.formatTime(new Date(res.data.expireTime))
      this.setData({
        csTask: res.data.csTask,
        csUserTask: res.data
      })
      _.get('cstask/task/detail', {
        csTaskId: this.data.csTask.id
      }, res => {
        let tmp = []
        for (let i in res.data.csQuestions) {
          tmp.push('')
        }
        let id2display = {}
        res.data.csQuestions = res.data.csQuestions.map(val => {
          // val.content = '{"content":"xxxxxxx$xxxx$","params":[{"content":"123","style":"color: red"},{"content":"456","style":"color: red"}]}'
          if (val.content[0] === '{') {
            // 需要解析成富文本
            val.isRichText = true
            let tmp = JSON.parse(val.content)
            let params = tmp.params
            let content = tmp.content.split('$')
            let richText = []
            for (let i in content) {
              let idx = Number(i)
              richText.push({
                type: 'text',
                text: content[i]
              })
              if (idx < params.length) {
                richText.push({
                  type: 'node',
                  name: 'span',
                  attrs: {
                    style: params[idx].style
                  },
                  children: [{
                    type: 'text',
                    text: params[idx].content
                  }]
                })
              }
            }
            val.richText = richText
          } else {
            val.isRichText = false
          }
          if (val.conditions) {
            val.conditions = JSON.parse(val.conditions)
          } else {
            val.conditions = []
          }
          if (val.tableContent) {
            val.tableContent = JSON.parse(val.tableContent)
            if (val.tableContent.rows.length === 0) {
              val.tableContent = ''
            } else {
              val.tableContent.width = (100 / val.tableContent.rows[0].length) + '%'
            }
          } else {
            val.tableContent = ''
          }
          id2display[val.id] = false
          return val
        })
        for (let i in res.data.csQuestions) {
          res.data.csQuestions[i].index = Number(i) + 1
        }
        this.setData({
          csQuestions: res.data.csQuestions,
          id2display: id2display,
          response: tmp,
        })
        this.goToNext()
      })
    })
  },

  onInputRes: function (event) {
    let res = event.detail.value
    let idx = parseInt(event.currentTarget.dataset.idx)
    let id = parseInt(event.currentTarget.dataset.id)
    _.D(res, idx, id)
    this.data.id2res[id] = res
    this.data.response[idx] = res
    this.setData({
      response: this.data.response,
      id2res: this.data.id2res,
    })
  },

  doJudge: function (event) {
    let val = event.currentTarget.dataset.val
    let idx = parseInt(event.currentTarget.dataset.idx)
    let id = parseInt(event.currentTarget.dataset.id)
    _.D(val, idx) 
    this.data.id2res[id] = val
    this.data.response[idx] = val
    this.setData({
      response: this.data.response,
      id2res: this.data.id2res,
    })
  },

  continueChoose: function (event) {
    let val = event.currentTarget.dataset.val
    let next = {}
    let idx = val ? this.data.currQ.next1 : this.data.currQ.next2
    if (idx !== null) {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      utId: options.id
    })
    this.loadUserTask()
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