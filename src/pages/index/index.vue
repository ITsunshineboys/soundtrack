<template>
  <div class="box">
    <video id="curVideo" :style="{'height': screenH}" :muted='true' :objectFit='fill' :show-center-play-btn='false' :controls='false' :src="curVideo.videoUrl"></video>
    <layer :curVideo="curVideo"></layer>
  </div>
</template>

<script>
import layer from '@/components/layer'
import {mapState, mapActions} from 'vuex'

export default {
  data () {
    return {
      screenH: '0'
    }
  },

  components: {
    layer
  },

  methods: {
    ...mapActions([
      'getUserInfo',
      'getVideoStatus',
      'changeVideo'
    ]),
    // 获取设备信息
    getSystem (flag) {
      var that = this
      var curTime = Date.parse(new Date())
      wx.getSystemInfo({
        success: (res) => {
          that.screenH = res.windowHeight + 'px'
          if (flag) {
            that.getUserInfo(that.crypto.createHash('md5').update(res.brand + res.model + res.screenWidth + res.screenHeight + res.version + res.system + res.fontSizeSetting + res.network + curTime + parseInt(Math.random() * 100000000)).digest('hex'))
            // 设备信息和获取唯一用户标识
            wx.getNetworkType({
              success (r) {
                var obj = {
                  userid: that.identity,
                  brand: res.brand,
                  model: res.model,
                  pixelRatio: res.pixelRatio,
                  screenWidth: res.screenWidth,
                  screenHeight: res.screenHeight,
                  windowWidth: res.windowWidth,
                  windowHeight: res.windowHeight,
                  statusBarHeight: res.statusBarHeight,
                  language: res.language,
                  version: res.version,
                  system: res.system,
                  platform: res.platform,
                  fontSizeSetting: res.fontSizeSetting,
                  network: r.networkType,
                  SDKVersion: res.SDKVersion
                }
                console.log(obj)
                // 上传设备信息到服务器
                // that.$http.post('/api/dyapi/deviceinfo', obj).then(function (res) {
                //   console.log(res)
                // })
              }
            })
          }
        }
      })
    }
  },

  created () {
    wx.login({
      success: function () {
      }
    })
    this.getVideoStatus()// 初始化数据
    // 默认请求数据
    this.getVideoStatus({
      videoUrl: 'http://yun.it7090.com/video/XHLaunchAd/video01.mp4',
      status: false,
      error: 0,
      sc: 0,
      pc: 0,
      time: '00:00:000',
      audiourl: {name: '第一首歌', url: 'http://music.163.com/song/media/outer/url?id=483671599.mp3'},
      otheraudio: [{name: '第二首歌', url: 'http://music.163.com/song/media/outer/url?id=224133.mp3'}, {name: '第三首歌', url: 'http://music.163.com/song/media/outer/url?id=86849.mp3'}, {name: '第四首歌', url: 'http://music.163.com/song/media/outer/url?id=26113988.mp3'}]
    })
    this.changeVideo()
  },
  computed: {
    ...mapState([
      'userInfo',
      'questionInfo',
      'curVideo'
    ])
  },
  onShow () {
    var that = this
    // 检测是否拥有userid
    wx.getStorage({
      key: 'vuex',
      success (res) {
        console.log('缓存存在信息')
        var data = JSON.parse(res.data)
        if (data && data.userInfo && data.userInfo.identity && data.userInfo.identity !== '') {
          that.getSystem(false)
        } else {
          that.getSystem(true)
        }
      },
      fail () {
        console.log('缓存不存在信息')
        that.getSystem(true)
      }
    })
  }
}
</script>

<style scoped>
  .box {
    font-size: 0;
  }

  video {
    width: 100%;
    z-index: 2;
  }
</style>
