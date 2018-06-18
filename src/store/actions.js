export default {
  getUserInfo ({commit, state}, name) {
    commit('GETUSERINFO', {name})
  },
  getVideoStatus ({commit, state}, obj, index) {
    commit('GETVIDEOSTATUS', {obj, index})
  },
  changeVideo ({commit, state}, obj) {
    commit('CHANGEVIDEO', {obj})
  },
  judgeRight ({commit, state}, obj) {
    commit('JUDGERIGHT', {obj})
  }
}
