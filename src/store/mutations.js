import {GETUSERINFO, GETVIDEOSTATUS, CHANGEVIDEO, JUDGERIGHT, GETVIDEOPOS, CLEARVIDEODATA} from './mutation-types'
export default {
  [GETUSERINFO] (state, {obj}) {
    state.userInfo = obj
  }, // 获取用户信息
  [GETVIDEOSTATUS] (state, {obj}) {
    console.log(obj)
    state.questionInfo = obj.questionInfo
    if (obj.firstSetting) {
      // console.log(obj.questionInfo)
      state.curVideo = state.questionInfo[0]
    }
  }, // 获取视频
  [CHANGEVIDEO] (state, {obj}) {
    if (obj === undefined) {
      // state.curVideo = state.questionInfo[0]
    } else {
      state.curVideo = obj
      state.questionInfo.map((item, index) => {
        if (item.id === obj.id) {
          state.questionInfo[index] = obj
        }
      })
    }
  }, // 当前视频状态改变
  [JUDGERIGHT] (state, {obj}) {
    var curVideo = obj.obj
    state.questionInfo.map((item) => {
      if (item.id === curVideo.id) {
        item.status = obj.status
      }
    })
    // if (obj.flag) {
    //   state.questionInfo.map((item) => {
    //     if (item.id === obj.id) {
    //       item.status = 1
    //     }
    //   })
    //   console.log(state.questionInfo)
    //   state.curVideo.status = 1
    // } else {
    //   state.questionInfo.map((item) => {
    //     if (item.id === obj.id) {
    //       item.status = 2
    //     }
    //   })
    //   state.curVideo.status = 2
    // }
  }, // 判断是否正确
  [GETVIDEOPOS] (state, {obj}) {
    if (state.questionInfo.length <= 1) {
      state.position = 3
    } else {
      var index = state.questionInfo.findIndex((item) => {
        return item.id === obj.id
      })
      if (index === 0) {
        state.position = 0
      } else if (index === state.questionInfo.length - 1) {
        state.position = 2
      } else {
        state.position = 1
      }
    }
  }, // 获得视频当前位置
  [CLEARVIDEODATA] (state) {
    state.questionInfo = []
    state.curVideo = {}
    state.position = 0
  } // 清除视频数据
}
