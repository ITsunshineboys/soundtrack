import {GETUSERINFO, GETVIDEOSTATUS, CHANGEVIDEO, JUDGERIGHT} from './mutation-types'
export default {
  [GETUSERINFO] (state, {name}) {
    state.userInfo.identity = name
  },
  [GETVIDEOSTATUS] (state, {obj, index}) {
    if (obj !== undefined) {
      if (index === undefined) {
        state.questionInfo.push(obj)
      } else {
        state.questionInfo[index] = obj
      }
    } else {
      state.questionInfo = []
      state.curVideo = {}
    }
  },
  [CHANGEVIDEO] (state, {obj}) {
    if (obj === undefined) {
      state.curVideo = state.questionInfo[0]
    } else {
      state.curVideo = obj
    }
  },
  [JUDGERIGHT] (state, {obj}) {
    state.questionInfo.map((item) => {
      if (item.url === obj.url) {
        item.right = true
      } else {
        item.right = false
      }
    })
    state.curVideo.right = true
  }
}
