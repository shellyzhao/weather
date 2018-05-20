const weatherMap = {
  多云: 'cloudy',
  晴天: 'sunny',
  阴: 'overcast',
  小雨: 'lightrain',
  大雨: 'heavyrain',
  雪: 'snow',
}
const weatherColorMap = {
  多云: '#deeef6',
  晴天: '#cdeefd',
  阴: '#c6ced2',
  小雨: '#bdd5e1',
  大雨: '#c5ccd0',
  雪: '#aae1fc',
}
Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
  },
  onLoad(){
    // console.log("Hello World");

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
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      }
    });

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
  }
})