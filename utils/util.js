// const baseUrl = 'http://localhost:9071/v1/'
const baseUrl = 'http://i3city.evo.qk0.cc/api/i3city-evo/v1/'
// const baseUrl = ‘http://127.0.0.1:9071/v1/’
// const baseUrl='http://localhost:9071/swagger-ui/'
const env = ''

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getUrl (url, paras) {
  url += '?'
  console.log(url)
  for (let i in paras) {
    if (paras[i] !== null) {
      url += `${i}=${encodeURIComponent(paras[i])}&`
    }
  }
  console.log(url)
  console.log(url.substr(0, url.length - 1))
  return url.substr(0, url.length - 1)
}

function removeNull(param) {
  let obj = {}
  for (let i in param) {
    if (param !== null) {
      obj[i] = encodeURIComponent(param[i])
    }
  }
  return obj
}

function defaultErrorHandler(error) {
  console.log(error.data)
  if (!error.data || !error.data.message) {
    wx.navigateTo({
      url: '/pages/mine/login/login',
    })
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res.code)
    //     checkLogin(res.code, () => {
    //       wx.switchTab({
    //         url: '/pages/market/index/index',
    //       })
    //     })
    //   }
    // })
  }
}

function requestHandler(handler, errorHandler, ignore = false) {
  console.log(handler)
  return res => {
    if (res.statusCode < 300) {
      handler(res)
      console.log(res)
    } else {
      let currPage = getCurrentPages()
      console.log("11")
      console.log(currPage)
      let href
      if (currPage.length > 1) {
        href = currPage[currPage.length - 1].__route__
        wx.setStorageSync('tmpOption', currPage[currPage.length - 1].options)
      } else if (currPage.length === 1) {
        if (currPage[0].__route__.indexOf('support') >= 0) {
          href = currPage[currPage.length - 1].__route__
          wx.setStorageSync('tmpOption', currPage[currPage.length - 1].options)
        } else {
          href = '/pages/discover/index/index'
        }
      } else {
        href = '/pages/discover/index/index'
      }
      // 错误处理逻辑
      if (!ignore) {
        switch (res.data.code) {
          case 4: {
            refreshSp()
            wx.reLaunch({
              url: href,
            })
            break
          }
          case 5: {
            console.log(href)
            wx.redirectTo({
              url: '/pages/login/index/index?redirect=/' + href,
            })
            break
          }
        }
      }
      if (errorHandler) {
        errorHandler(res)
      }
    }
  }
}

function myGet(url, data, success = () => { }, errorHandler = defaultErrorHandler, ignore = false) {
  let header = {
    'Access-Token': wx.getStorageSync(env + 'sp'),
  }
  if (url=="cstask/acceptedTask/list") {
    console.log("11请求链接") 
  }
  //data即是目前的状态“待完成”，“已完成”，“已过期”的选择
  wx.request({
    url: baseUrl + url,
    data: data,
    header: header,
    method: 'GET',
    dataType: 'json',
    success: requestHandler(success, errorHandler, ignore),
    fail: res => {
      console.log(res)
    },
    complete: function (res) { },
  })
}

function myDelete(url, data, success = () => { }, errorHandler = defaultErrorHandler) {
  let header = {
    'Access-Token': wx.getStorageSync(env + 'sp'),
  }
  wx.request({
    url: baseUrl + url,
    data: data,
    header: header,
    method: 'delete',
    dataType: 'json',
    success: requestHandler(success, errorHandler),
    fail: res => {
      console.log(res)
    },
    complete: function (res) { },
  })
}

function myPost(url, paras, data, success = () => { }, errorHandler = defaultErrorHandler, ignore = false) {
  let header = {
    'Access-Token': wx.getStorageSync(env + 'sp'),
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  // let header = {
  //   "Content-Type":"application/x-www-form-urlencoded",
  // }
  console.log(header)
  console.log("参数显示")
  console.log(paras)
  wx.request({
    url: getUrl(baseUrl+url,paras),
    method: 'POST',
    header: header,
    data: removeNull(data),
    dataType: 'json',
    success: requestHandler(success, errorHandler, ignore),
    // url: getUrl(baseUrl+url,paras),
    // data: removeNull(data),
    // header: header,
    // method: 'POST',
    // dataType: 'json',
    // success: requestHandler(success, errorHandler, ignore),
    fail: res => {
      console.log(res)
    },
    complete: function (res) { },
  })
}

function checkLogin (code, data, cb = () => {}) {
  myPost('csuser/login/check', {
    code: code,
    data: data,
  }, {}, res => {
    console.log(res.data)
    wx.setStorageSync('sp', res.data)
    cb()
  })
}

module.exports = {
  D: console.log,
  formatTime: formatTime,
  get: myGet,
  post: myPost,
  del: myDelete,
  checkLogin: checkLogin,
}
