import Vue from 'vue'
import App from './App'
import Fly from 'flyio/dist/npm/wx'
import store from './store/index'
import crypto from 'crypto'
// 配置请求
var fly = new Fly()
fly.interceptors.request.use((config, promise) => {
  // 给所有请求添加自定义header
  config.headers['X-Tag'] = 'flyio'
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
  return config
})
fly.config.baseURL = 'https://www.420csd.com'
Vue.prototype.$http = fly

Vue.config.productionTip = false
App.mpType = 'app'

// 配置vuex
Vue.prototype.$store = store
// 配置MD5加密
Vue.prototype.crypto = crypto

const app = new Vue(App)
app.$mount()

// noinspection JSAnnotator
export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/logs/main', '^pages/index/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '我是玩音达人',
      navigationBarTextStyle: 'black'
    }
  }
}
