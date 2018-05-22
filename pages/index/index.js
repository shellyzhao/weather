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
    forecast: [],
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
    // console.log("Hello World");
    
    this.getNow();
    // onLoad中没有传入回调函数，所以不会执行停止下拉刷新

    wx.request({
      url: 'https://api.seniverse.com/v3/weather/daily.json?key=j03ff2ziir99zle2&language=zh-Hans&unit=c&start=0&days=5', //调用心知天气的免费天气预报Api，可返回三天的天气预报
      data: {
        // 修改城市为成都
        location: 'chengdu',

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res)

      }
    })
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
        let temp = result.now.temperature
        let weather = result.now.text
        console.log(temp, weather)
        this.setData({
          nowTemp: temp,
          nowWeather: weather,
          nowWeatherBackground: '/images/' + weatherMap[weather] + '-bg.png'

        })
        //set forcast
        let forecast = []
        let newHour = new Date().getHours()
        for (let i = 0; i < 24; i += 3) {
          forecast.push({
            //取当前时间每隔三小时的预报，超过24小时取余
            time: (i + newHour) % 24 + '时',
            iconPath: '/images/sunny-icon.png',
            temp: '12°'

          })
        }
        forecast[0] = 
        this.setData({
          forecast: forecast
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete: ()=> {
        // 有回调函数传入，执行callback
        callback && callback()
      }
    });
  }
})