//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)    
  },
  
  globalData: {
    voice : {},
    PIR : {},
    Humidity : {},
    Temperature:{},
    degree:{},
    temp_con:{},
    in_temp:{},
    in_humi:{}
   
  }
})