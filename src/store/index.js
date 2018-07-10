import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: {}, // 用户信息
  questionInfo: [], // 所有视频
  curVideo: {}, // 当前视频
  position: 0 // 视频位置
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        // removeItem: () => wx.clearStorage()
        removeItem: () => {
          if (wx.getStorageSync('vuex') !== '') {
            var curItem = JSON.parse(wx.getStorageSync('vuex'))
            curItem.curVideo = {}
            curItem.questionInfo = []
            curItem.position = 0
            wx.setStorageSync('vuex', JSON.stringify(curItem))
          }
        }
      }
    })
  ]
})
