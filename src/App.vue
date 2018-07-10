<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState([
        'questionInfo',
        'curVideo'
      ])
    },
    methods: {
      ...mapActions([
        'clearVideoData',
        'getUserInfo',
        'getVideoStatus',
        'changeVideo',
        'judgeRight',
        'getVideoPos'
      ])
    },
    created () {
      // 调用API从本地缓存中获取数据
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      console.log('app created and cache logs by setStorageSync')
    },
    onShow: function (res) {
      console.log('获取场景值')
      console.log(res)
      if ((res.scene === 1007 || res.scene === 1008) && res.reLaunch) {
        this.clearVideoData()
        // console.log(res.query.obj)
        // var curVideo = JSON.parse(res.query.obj)
        // var index = this.questionInfo.findIndex((item) => {
        //   return item.id === curVideo.id
        // })
        // if (index === -1) {
        //   this.questionInfo.push(curVideo)
        //   this.getVideoStatus({questionInfo: this.questionInfo, firstSetting: true})
        // } else {
        //   this.curVideo = this.questionInfo[index]
        //   this.changeVideo(this.curVideo)
        // }
      }
    },
    onLaunch () {
      this.clearVideoData()
    }
  }
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
