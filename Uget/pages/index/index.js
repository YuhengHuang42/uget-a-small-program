//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  
  },
 
  jumpTo:function(){
    wx.navigateTo({
      url: '../detail/detail'
    })
  },//此函数实现点击色块跳转功能

  //处理获得数据的函数
  
  dealwithdata:function(){
   var voice=0;
   var PIR = 0.0;
   var Humidity = 0.0;
   var Temperature = 0.0;
   var length = app.globalData.voice.datapoints.length;
   //获得长度，以进行下一步处理
   const voice_i=0.3;
   const PIR_i = 0.7;//声音和红外传感器的比例系数
   const voice_rate =2;
   const PIR_rate = 100;//声音和红外传感器的放大系数，使数值判断更易
   const judge_L=58;//超过这个值，显示现场人流较为拥挤
   const judge_M = 40;//超过这个值，显示现场人流正常
   var judge=0;
   for (var i = 0; i < length; i++) {
     voice=voice+parseFloat(app.globalData.voice.datapoints[i].value);
     PIR = PIR + parseFloat(app.globalData.PIR.datapoints[i].value);
     Humidity = Humidity + parseFloat(app.globalData.Humidity.datapoints[i].value);
     Temperature = Temperature + parseFloat(app.globalData.Temperature.datapoints[i].value);
   }//获得各个数据之和
   voice =voice/length;
   PIR = PIR / length;
   Humidity = Humidity/length;
   app.globalData.Humidity =Humidity;
   Temperature = Temperature/length;
   app.globalData.in_temp = Temperature;
   app.globalData.in_humi = Humidity;//计算平均数，给全局变量赋值
   judge = PIR * PIR_rate * PIR_i +voice*voice_rate*voice_i;
   //对红外线感应器和声音感应器的数据进行加权计算，获得判断依据
   if (judge > judge_L)
     app.globalData.degree=2;
   else if (judge > judge_M)
     app.globalData.degree = 1;
   else app.globalData.degree = 0;
   /*console.log(app.globalData.degree);
   console.log(voice);
   console.log(PIR);
   console.log(Humidity);
   console.log(Temperature);
   console.log(judge);
   console.log(app.globalData.degree);*/
//调试内容
//调用百度天气API，获得室外数据
   const requestTask = wx.request({
     url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=6tYzTvGZSOpYB5Oc2YGGOKt8', //百度天气API
     header: {
       'content-type': 'application/json',
     },

     success: function (res) {
       var str = res.data.results[0].weather_data[0].date;
       var tmp1 = str.match(/实时.+/);
       var tmp2 = tmp1[0].substring(3, tmp1[0].length - 2);
       var tmp = +tmp2;
       if(tmp>Temperature)
       app.globalData.temp_con = tmp - Temperature;
       else app.globalData.temp_con = Temperature-tmp;
     },
     //获得温差的绝对值
     

     fail: function (res) {
       console.log("fail!!!")
     },

     complete: function (res) {
       console.log("end")
     }
      
   })
   //抛弃的功能，实现跳出窗口汇报，因略显多余删去
   /*if (judge > judge_L) {
       wx.showModal({
         title: '详细信息',
         content: '人流较多！',
         success: function (res) {
           if (res.confirm) {
             console.log('用户点击确定')
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })
     }
     //规则为低于门限报警，于是不报警
   else if (judge > judge_M) {
       wx.showModal({
         title: '详细信息',
         content: '人流情况正常',
         success: function (res) {
           if (res.confirm) {
             console.log('用户点击确定')
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })
     }
   //温度低于设置的门限值
   else{
     //规则为高于门限报警，于是不报警
       wx.showModal({
         title: '详细信息',
         content: '现场人员较少',
         success: function (res) {
           if (res.confirm) {
             console.log('用户点击确定')
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })
     }*/


     //处理色块的变化
   const ctx = wx.createCanvasContext('myCanvas')
   if (app.globalData.degree == 2)
     ctx.setFillStyle('red');
   else if (app.globalData.degree == 1)
     ctx.setFillStyle('yellow');
   else
     ctx.setFillStyle('green');
   ctx.fillRect(1, 1, 380, 50)
   ctx.draw()
  },

  //从onenet上获得数据
  getDataFromOneNet: function () {
    const requestTask = wx.request({
      url: 'https://api.heclouds.com/devices/23343719/datapoints?datastream_id=voice,PIR,Humidity,Temperature&limit=20',
      header: {
        'content-type': 'application/json',
        'api-key': 'BtBf3i4CJAfI8z3e3iY=I13VP0c='
      },
      success: function (res) {
        console.log(res.data)
        var app = getApp()
        app.globalData.voice = res.data.data.datastreams[0]
        app.globalData.PIR = res.data.data.datastreams[3]
        app.globalData.Humidity = res.data.data.datastreams[2]
        app.globalData.Temperature = res.data.data.datastreams[1]
        console.log(app.globalData.voice)
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      },
    })
  

  },

  onLoad: function () {
    
  }
})