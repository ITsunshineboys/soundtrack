export default {
  getUserInfo ({commit, state}, obj) {
    commit('GETUSERINFO', {obj})
  },
  getVideoStatus ({commit, state}, obj) {
    commit('GETVIDEOSTATUS', {obj})
  },
  changeVideo ({commit, state}, obj) {
    commit('CHANGEVIDEO', {obj})
  },
  judgeRight ({commit, state}, obj) {
    commit('JUDGERIGHT', {obj})
  },
  getVideoPos ({commit, state}, obj) {
    commit('GETVIDEOPOS', {obj})
  },
  clearVideoData ({commit, state}) {
    commit('CLEARVIDEODATA')
  }
}
