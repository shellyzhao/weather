const weatherMap = {
  多云: 'cloudy',
  晴天: 'sunny',
  阴: 'overcast',
  小雨: 'lightrain',
  中雨: 'heavyrain',
  大雨: 'heavyrain',
  雪: 'snow',
}
const weatherColorMap = {
  多云: '#deeef6',
  晴天: '#cdeefd',
  阴: '#c6ced2',
  小雨: '#bdd5e1',
  大雨: '#c5ccd0',
  中雨: '#c5ccd0',
  雪: '#aae1fc',
}
Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayTemp: '',
    todayDate: ''
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      // 传入匿名函数
      // 在匿名函数中执行停止下拉刷新
      // 这样执行的结果就是只有在下拉刷新执行后才会运行停止下拉刷新
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){ 
    this.getNow();
    // onLoad中没有传入回调函数，所以不会执行停止下拉刷新

  //   wx.request({
  //     url: 'https://api.seniverse.com/v3/weather/daily.json?key=j03ff2ziir99zle2&language=zh-Hans&unit=c&start=0&days=5', //调用心知天气的免费天气预报Api，可返回三天的天气预报
  //     data: {
  //       // 修改城市为成都
  //       location: 'chengdu',

  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: res => {
  //       console.log(res)

  //     }
  //   })
  },
  getNow(callback){
    // getNow传入回调函数callback
    wx.request({
      url: 'https://api.seniverse.com/v3/weather/now.json?key=j03ff2ziir99zle2&language=zh-Hans&unit=c', //调用心知天气的免费实时天气Api
      data: {
        // 修改城市为成都
        location: 'chengdu',

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res)
        let result = res.data.results[0]
        this.setNow(result)
      },
      complete: ()=> {
        // 有回调函数传入，执行callback
        callback && callback()
      }
    });
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '成都市'
      },
      success: res => {
        console.log(res)
        let forecastResult = res.data.result
        this.setHourlyWeather(forecastResult)
        // let temp = result.now.temp
        // let weather = result.now.weather
        // this.setData({
        //   nowTemp: temp + '°',
        //   nowWeather: weatherMap[weather],
        //   nowWeatherBackground: '/images/' + weather + '-bg.png'
        // })
        // wx.setNavigationBarColor({
        //   frontColor: '#000000',
        //   backgroundColor: weatherColorMap[weather],
        // })

        //set hourlyWeather
        this.setToday(forecastResult)

      },
      complete: () => {
        callback && callback()
      }
    })
  },
  //代码重构，将getNow函数里面success的回调函数，设置天气的部分拆分成setNow和setHourlyWeather，分别代表设置当前天气和设置每小时天气，这样比较清晰，success的回调函数就只用获取天气就行了
  setNow(result) {
    let temp = result.now.temperature
    let weather = result.now.text
    console.log(temp, weather)
    this.setData({
      nowTemp: temp,
      nowWeather: weather,
      nowWeatherBackground: '/images/' + weatherMap[weather] + '-bg.png'

    }),
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: weatherColorMap[weather],
      })
  },
  setHourlyWeather(forecastResult) {
    let forecast = forecastResult.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + "时",
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(forecastResult) {
    let date = new Date()
    this.setData({
// `$用于字符串拼接，`常量${变量}常量`例如： var a = 1; console.log('一共有' + a + '个鸡蛋！')

// 那么现在你只要console.log(`一共有${a}个鸡蛋！`)
      todayTemp: `${forecastResult.today.minTemp}° - ${forecastResult.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather() {
    // 调用微信显示toast
    wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list'
    })
  }
})