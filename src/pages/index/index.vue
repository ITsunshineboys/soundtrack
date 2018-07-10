<template>
  <div class="box">
    <!--视频-->
    <video id="curVideo" :style="{'height': screenH}" @error.stop="playError($event)" v-if="!curVideo.paused" @ended.stop="stopVideo"  autoplay :custom-cache="false" @play="playVideo" :muted='true'
           objectFit='cover' :show-center-play-btn='false' :controls='false' :src="curVideo.videourl"></video>
    <!--视频未播放时蒙层-->
    <div @click.stop="setDotPraise($event)" class="answerStatus" v-if="curVideo.paused" :style="{'height': screenH,'background-image':'url('+curVideo.img+')'}">
      <!--<img class="occupy_bitmap" src="" alt="">-->

      <div v-if="curVideo.status == 3 || curVideo.status == 5" class="down" @click.stop="toggleVideo('down')">
      <img src="/static/down_arrow.png" alt="">
      </div>
      <p class="timing" v-if="curVideo.status != 5 && curVideo.status != 3">{{curVideo.time}}</p>
      <img class="dot_praise" :style="{top: item.y,left: item.x}" v-for="(item,index) in praise" :key="index" :src="dot[item.num]">
      <img class="play" src="/static/play_btn.png" @click.stop="playback" v-if="curVideo.paused && (curVideo.status == 3 || curVideo.status == 5)">
      <div class="btnGroup" v-if="curVideo.status == 3 || curVideo.status == 5">
        <span class="add" v-for="(item, index) in praise" :key="index">+1</span>
        <img :src="curVideo.pc > 0?'/static/dot_praise.png':'/static/no_dot_praise.png'" style="width: 30px;height: 27.5px;">
        <p style="text-align: center;">{{curVideo.pc}}</p>
        <button id="normal" :open-type="shareStatus" @click.stop="authShare" @getuserinfo.stop="authShare($event)">
          <img :src="curVideo.hearts > 0 ?'/static/wechat.png':'/static/share.png'" :style="{'width': curVideo.hearts > 0?'28.5px':'30px',
          'height': curVideo.hearts > 0?'28.5px':'26px'}">
        </button>
        <p style="text-align: center;">{{curVideo.sc}}</p>
      </div>
      <!--选择音乐界面-->
      <div class="audio" v-if="curVideo.status == 0 || curVideo.status == 4">
        <p class="tips">请选择正确的配乐</p>
        <div class="audioItem" v-for="(item, index) in curAudio" @click.stop="playAudio(item, index)"
                    :key="index">
          <div class="logo">
            <img src="/static/logo.png">
          </div>
          <p class="audioName" v-if="item.paused && item.status">{{item.name}}</p>
          <p class="progress"  :style="{'width':item.progress,'background':item.status?'rgba(255, 255, 255, .5)':'rgba(255, 0, 0, .5)'}"></p>
          <p class="placeholder" v-if="!item.paused && item.status">确认</p>
          <p class="placeholder" v-if="!item.paused && !item.status">配乐错误</p>
        </div>
      </div>
      <!--选择失败界面-->
      <div class="fail" v-if="curVideo.status == 1">
        <!--<p class="fail_tips" v-if="curVideo.status == 1">配乐错误。没关系，你还有一次机会</p>-->
        <div class="audioItem">
          <div class="logo">
            <img src="/static/logo.png">
          </div>
          <p class="audioName">{{playInAudio.name}}</p>
          <p class="progress" :style="{'width':playInAudio.progress}"></p>
        </div>
        <!--<p class="success_tips" v-if="curVideo.status == 5">没关系，失败也可以</p>-->
      </div>
      <!--选择成功界面-->
      <div class="success" v-if="curVideo.status == 3">
        <p class="timing">{{curVideo.time}}</p>
        <p class="success_tips" >恭喜你，你就是达人！</p>
        <div class="audioItem">
          <div class="logo">
            <img src="/static/logo.png">
          </div>
          <p class="audioName">{{playInAudio.name}}</p>
          <p class="progress" :style="{'width':playInAudio.progress}"></p>
        </div>
      </div>
      <!--答题完成两次错误状态-->
      <img v-if="curVideo.status == 5" src="/static/two_times_error.png" class="two_times" alt="">
    </div>
    <!--视频播放时蒙层-->
    <cover-view class="layer" @click.stop="playComplete" v-if="!curVideo.paused" :style="{'background-image':curVideo.img}">
      <!--<cover-view style="font-size: 20px;color: red;">{{curVideo.paused}}</cover-view>-->
      <!--计时器-->
      <cover-view class="timing" v-if="curVideo.status == 0 || curVideo.status == 4" >{{curVideo.time}}
      </cover-view>
      <!--选择音乐界面-->
      <cover-view class="audio" v-if="curVideo.status != 5 && curVideo.status != 3">
        <cover-view class="tips">请选择正确的配乐</cover-view>
        <cover-view class="audioItem" v-for="(item, index) in curAudio" @click.stop="playAudio(item, index)"
                    :key="index">
          <cover-view class="logo">
            <cover-image src="/static/logo.png"></cover-image>
          </cover-view>
          <cover-view class="audioName" v-if="item.paused && item.status">{{item.name}}</cover-view>
          <cover-view class="progress" :style="{'width':item.progress,'background':item.status?'rgba(255, 255, 255, .5)':'rgba(255, 0, 0, .5)'}"></cover-view>
          <cover-view class="placeholder" v-if="!item.paused && item.status">确认</cover-view>
          <cover-view class="placeholder" v-if="!item.paused && !item.status">配乐错误</cover-view>
        </cover-view>
      </cover-view>
      <!--<cover-view style="font-size: 20px;color: red;position: absolute;top: 50px;left: 0;z-index: 4;">{{value1}}111</cover-view>-->
    </cover-view>
        <!--第一次选择失败分享-->
    <div class="modal_box" v-if="curVideo.status === 1">
          <div class="modal" style="background-image: url('https://www.420csd.com/uploads/dy/error_share_bg.png')">
        <button id="error1" :open-type="shareStatus" @getuserinfo.stop="authShare($event)" class="share_btn" style="background-image: url('https://www.420csd.com/uploads/dy/share_btn.png')"></button>
        <img @click.stop="refuseShare" class="refuse" src="/static/close.png" alt="">
      </div>
    </div>
    <!--第二次失败分享-->
    <div class="modal_box" v-if="curVideo.status === 2">
      <div class="modal2" style="background-image: url('https://www.420csd.com/uploads/dy/error_share_bg2.png')">
        <p class="title">您已经连续配乐成功<span class="times">{{straightAnswer}}</span>次</p>
        <button id="error2" @click="getShareImg(2)" class="share_btn" style="background-image: url('https://www.420csd.com/uploads/dy/share_btn.png')"></button>
        <img @click.stop="refuseShare" class="refuse" src="/static/close.png" alt="">
      </div>
    </div>
    <!--倒计时-->
    <!--<div class="countdown" :style="{'height': screenH,'line-height': screenH}" v-if="num > 0">-->
      <!--<p>{{num}}</p>-->
    <!--</div>-->
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {EventEmitter} from 'events'
const innerAudioContext = wx.createInnerAudioContext()

export default {
  data () {
    return {
      screenH: '0', // 获取屏幕高度
      // curVideo: {}, // 当前视频
      index: '',
      curAudio: [], // 所有音频
      praise: [], // 点赞
      playInAudio: {}, // 播放中音频
      timer: '', // 定时器
      videoContext: '', // 视频
      privacy: {}, // 私密数据
      avatar: 'https://www.420csd.com/uploads/dy/default_avatar.png',
      shareStatus: 'getUserInfo',
      num: 3, // 倒计时
      page: 1, // 分页
      straightAnswer: 0, // 连续答对次数
      shareImg: '', // 分享图片链接
      // saveImg: '', // 保存图片链接
      dot: ['/static/dot_praise1.png', '/static/dot_praise2.png'], // 不同形式爱心
      videoLen: 0,
      value1: ''
    }
  },

  components: {
    // layer
  },

  methods: {
    ...mapActions([
      'getUserInfo',
      'getVideoStatus',
      'changeVideo',
      'judgeRight',
      'getVideoPos'
    ]),
    // 获取设备信息
    getSystem (flag) {
      var that = this
      var curTime = Date.parse(new Date())
      wx.getSystemInfo({
        success: (res) => {
          that.screenH = res.windowHeight + 'px'
          if (flag) {
            that.userInfo = Object.assign(that.userInfo, {identity: that.crypto.createHash('md5').update(res.brand + res.model + res.screenWidth + res.screenHeight + res.version + res.system + res.fontSizeSetting + res.network + curTime + parseInt(Math.random() * 100000000)).digest('hex')})
            that.getUserInfo(that.userInfo)
            // 设备信息和获取唯一用户标识
            wx.getNetworkType({
              success (r) {
                // 设置设备信息和用户id
                var obj = {
                  userid: that.userInfo.identity,
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
                that.$http.post('/api/dyapi/deviceinfo', obj).then(function (res) {
                  // console.log(res)
                })
              }
            })
            // console.log(that.curVideo)
          }
          that.loginIn()
          that.getVideoList(true)
        }
      })
    },
    // 登陆
    loginIn () {
      var that = this
      wx.checkSession({
        success: function () {
          console.log('存在session-key')
          if (!that.userInfo.openid) {
            wx.login({
              success: function (res) {
                console.log(res)
                that.$http.post('/api/dyapi/getOpenid', {
                  js_code: res.code
                }).then(function (r) {
                  console.log(r)
                  console.log(JSON.parse(r.data.data))
                  var openid = JSON.parse(r.data.data)
                  console.log(openid)
                  that.userInfo = Object.assign(that.userInfo, openid)
                  that.getUserInfo(that.userInfo)
                  that.inputUserInfo()
                  // that.inputUserInfo()
                })
              }
            })
          } else {
            that.shareStatus = 'share'
          }
        },
        fail: function () {
          console.log('不存在session-key')
          wx.login({
            success: function (res) {
              console.log(res)
              that.$http.post('/api/dyapi/getOpenid', {
                js_code: res.code
              }).then(function (r) {
                console.log(r)
                console.log(JSON.parse(r.data.data))
                var openid = JSON.parse(r.data.data)
                console.log(openid)
                that.userInfo = Object.assign(that.userInfo, openid)
                that.getUserInfo(that.userInfo)
                that.inputUserInfo()
                // that.inputUserInfo()
              })
            }
          })
        }
      })
    },
    // 获取视频列表
    getVideoList (flag) {
      var that = this
      if (that.userInfo && that.userInfo.identity) {
        that.$http.post('/api/dyapi/videolist', {
          userid: that.userInfo.identity,
          nowpage: that.page
        }).then((res) => {
          console.log('视频列表')
          console.log(res)
          // console.log(that.questionInfo.length)
          var videoUrl = res.data.data
          that.videoLen = videoUrl.length
          videoUrl.map((item) => {
            item.time = '00:00:00' // 竞猜时间
            item.status = 0 // 音频状态 0第一次选择音乐 1第一次选择失败 2第二次选择失败 3选择成功 4第二次选择音乐 5存图成功
            item.paused = true
            item.img = 'http://dy.420csd.com' + item.img
            item.times = 0 // 当前用户分享数
            item.hearts = 0 // 当前用户点赞数
          })
          that.questionInfo.push.apply(that.questionInfo, videoUrl)
          if (flag) {
            that.getVideoStatus({questionInfo: that.questionInfo, firstSetting: true})
            that.dealAudio()
          } else {
            that.getVideoStatus({questionInfo: that.questionInfo, firstSetting: false})
          }
          console.log(that.questionInfo)
        })
      }
    },
    // 录入用户信息
    inputUserInfo () {
      var that = this
      // 检测授权
      wx.authorize({
        scope: 'scope.userInfo',
        success () {
          console.log('已经授权')
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.avatar = res.userInfo.avatarUrl
              that.userInfo = Object.assign(that.userInfo, res.userInfo)
              that.getUserInfo(that.userInfo)
              that.shareStatus = 'share'
              var obj = {
                userid: that.userInfo.userid,
                openid: that.userInfo.openid,
                nickName: that.userInfo.nickName,
                avatarUrl: that.userInfo.avatarUrl,
                gender: that.userInfo.gender,
                city: that.userInfo.city,
                province: that.userInfo.province,
                country: that.userInfo.country,
                language: that.userInfo.language
              }
              that.getShareImg(1)
              that.getShareImg(3)
              that.$http.post('/api/dyapi/userinfo', obj).then((res) => {
                console.log('录取用户信息成功===>' + res)
              })
            }
          })
        },
        fail () {
          console.log('未授权')
        }
      })
    },
    // 处理音频
    dealAudio () {
      var allAudio = this.curVideo.otheraudioarr.concat()
      allAudio.splice(parseInt(Math.random() * 3), 0, this.curVideo.audio)
      allAudio.map((item) => {
        item.progress = '0%'
        item.paused = true
        item.status = true
      })
      this.curAudio = allAudio
      console.log(this.curAudio)
    },
    // 点击播放视频
    playAudio (item) {
      console.log(this.curVideo.paused + 'zzz')
      var that = this
      if (item.status) {
        if (that.videoContext.pause) {
          that.videoContext.pause()
        }
        that.curAudio.map((item1) => {
          if (item1.url !== item.url && item1.status) {
            item1.progress = '0%'
          }
        })
        if (item.paused) {
          that.$set(that.curVideo, 'paused', false)
          that.videoContext = wx.createVideoContext('curVideo')
          that.videoContext.seek(0)
          that.videoContext.play()
          // console.log(that.curVideo)
        } else {
          that.videoContext.pause()
          // that.$set(that.curVideo, 'num', ++that.curVideo.num)
          this.curVideo.paused = true
          // this.curVideo.audio = that.playInAudio
          var index = that.curAudio.findIndex((item) => {
            return item.status === false
          })
          if (item.url === this.curVideo.audio.url) {
            // console.log(item)
            this.judgeRight({obj: that.curVideo, status: 3})
            that.$http.post('/api/dyapi/playinfo', {
              userid: that.userInfo.identity,
              openid: that.userInfo.openid,
              videoid: that.curVideo.id,
              status: 1,
              durtime: that.curVideo.time
            }).then((res) => {
              console.log('竞猜成功')
              // console.log(res)
              // that.curVideo.muted = false
            })
          } else {
            if (index === -1) {
              this.judgeRight({obj: that.curVideo, status: 1})
            } else {
              this.judgeRight({obj: that.curVideo, status: 2})
            }
            that.$http.post('/api/dyapi/playinfo', {
              userid: that.userInfo.identity,
              openid: that.userInfo.openid,
              videoid: that.curVideo.id,
              status: 0,
              durtime: that.curVideo.time
            }).then((res) => {
              console.log('竞猜失败')
              // console.log(res)
              that.curAudio.map((item) => {
                if (item.url === that.playInAudio.url) {
                  item.status = false
                }
              })
            })
          }
          // 获取此题二次答错前面连续答题数
          if (that.curVideo.status === 2) {
            that.straightAnswer = 0
            var curErrorIndex = that.questionInfo.findIndex((item) => {
              return item.id === that.curVideo.id
            })
            console.log(curErrorIndex)
            if (curErrorIndex === 0) {
            } else {
              for (var i = curErrorIndex - 1; i >= 0; i--) {
                if (that.questionInfo[i].status === 3) {
                  that.straightAnswer = that.straightAnswer + 1
                } else {
                  break
                }
              }
            }
          }
          innerAudioContext.pause()
          that.changeVideo(that.curVideo)
        }
        this.playInAudio = item
      }
    },
    // 监听视频播放
    playVideo () {
      var that = this
      var time
      // this.curVideo.paused = true
      this.curAudio.map((item) => {
        if (item.status !== false) {
          item.progress = '0%'
        }
        if (item.url === that.playInAudio.url || item.status === false) {
          item.paused = false
        } else {
          item.paused = true
        }
      })
      console.log(this.curAudio)
      console.log(that.playInAudio)
      innerAudioContext.autoplay = true
      if (that.curVideo.num === 2 && that.curVideo.status === 0) {
        innerAudioContext.src = that.curVideo.audio.url
      } else {
        innerAudioContext.src = that.playInAudio.url
      }
      innerAudioContext.seek(0)
      innerAudioContext.play()
      console.log(innerAudioContext)
      // that.videoContext.pause()
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
        // that.videoContext.play()
      })
      time = this.curVideo.time.split(':')
      innerAudioContext.onTimeUpdate(() => {
        console.log('播放时间改变')
        // that.videoContext.play()
        // console.log(innerAudioContext.duration)
        if (that.curVideo.status !== 3 && that.curVideo.status !== 5) {
          var min = parseInt(time[0])
          var sec = parseInt(time[1])
          var msec = parseInt(time[2])
          var realtime = parseInt(innerAudioContext.currentTime * 1000)
          msec = (msec + realtime % 1000) % 1000
          sec = sec + realtime / 1000
          if (sec > 60) {
            min = min + sec / 60
            sec = sec % 60
          }
          that.curVideo.time = (parseInt(min) < 10 ? ('0' + parseInt(min)) : parseInt(min)) + ':' + (parseInt(sec) < 10 ? ('0' + parseInt(sec)) : parseInt(sec)) + ':' + (msec < 100 ? ('0' + parseInt(parseInt(msec) / 10)) : parseInt(parseInt(msec) / 10))
          var curProgress = Object.assign(that.playInAudio, {progress: innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%'})
          var index = that.curAudio.findIndex((item) => {
            return item.url === that.playInAudio.url
          })
          that.$set(that.curAudio, index, curProgress)
        }
      })
      innerAudioContext.onError((res) => {
        // that.value1 = '音频播放失败' + JSON.stringify(res)
      })
      // }
      // 音频缓冲事件
      // innerAudioContext.onWaiting(() => {
      //   that.videoContext.pause()
      //   // clearInterval(that.timer)
      // })
    },
    // 监听视频缓冲或暂停
    stopVideo () {
      innerAudioContext.pause()
    },
    // 视频播放失败
    playError (e) {
      console.log(e)
      console.log('视频播放失败')
      this.value1 = '视频播放失败' + JSON.stringify(e)
    },
    // 点赞
    setDotPraise (e) {
      console.log(e)
      if (this.curVideo.status === 5 || this.curVideo.status === 3) {
        this.$set(this.curVideo, 'pc', ++this.curVideo.pc)
        this.$set(this.curVideo, 'hearts', ++this.curVideo.hearts)
        this.changeVideo(this.curVideo)
        this.$http.post('api/dyapi/praiseinfo', {
          userid: this.userInfo.identity,
          openid: this.userInfo.openid,
          videoid: 1,
          times: this.totalClick
        }).then((res) => {
          console.log('点赞成功')
        })
        this.praise.push({x: e.clientX + 'px', y: e.clientY + 'px', num: parseInt(Math.random() * 2)})
      }
    },
    // 分享用户信息授权
    authShare (e) {
      console.log(e)
      var that = this
      if (e.mp.detail.userInfo) {
        console.log('用户信息授权成功')
        that.inputUserInfo()
      } else {
        console.log('用户授权失败')
      }
    },
    // 切换视频
    toggleVideo () {
      console.log(this.questionInfo)
      this.praise = []
      var that = this
      var index = this.questionInfo.findIndex((item) => {
        return item.id === that.curVideo.id
      })
      that.changeVideo(that.questionInfo[index + 1])
      that.dealAudio()
      // 获取更多视频
      console.log(index)
      if (index !== 0 && index % that.videoLen === 2) {
        this.page = this.page + 1
        this.getVideoList(false)
      }
    },
    // 成功和二次分享成功按钮播放
    playback () {
      if (this.curVideo.status === 3 || this.curVideo.status === 5) {
        this.curVideo.paused = !this.curVideo.paused
        this.videoContext = wx.createVideoContext('curVideo')
        this.videoContext.seek(0)
        this.videoContext.play()
        this.praise = []
      }
    },
    // 播放完成事件
    playComplete () {
      console.log(this.curVideo.status)
      if (this.curVideo.status === 3 || this.curVideo.status === 5) {
        this.curVideo.paused = !this.curVideo.paused
        innerAudioContext.stop()
      }
    },
    // 获取分享图
    getShareImg (time) {
      var that = this
      var obj
      if (time === 1) {
        obj = {
          status: 2,
          headimg: this.userInfo.avatarUrl,
          openid: this.userInfo.openid,
          nickname: this.userInfo.nickName
        }
      } else if (time === 2) {
        obj = {
          status: 3,
          headimg: this.userInfo.avatarUrl,
          openid: this.userInfo.openid,
          nickname: this.userInfo.nickName
        }
        wx.showLoading({
          title: '保存中'
        })
      } else {
        obj = {
          status: 1,
          headimg: this.userInfo.avatarUrl,
          openid: this.userInfo.openid,
          nickname: this.userInfo.nickName
        }
      }
      console.log('参数信息')
      console.log(obj)
      this.$http.post('/api/dyapi/createSharePng', obj).then((res) => {
        console.log('图片信息')
        console.log(res)
        that.shareImg = res.data
        var imgurl = res.data.data.imgurl
        if (time === 1) {
          // that.$set(that.userInfo, 'shareImg', imgurl)
          // that.value1 = imgurl
          that.userInfo = Object.assign(that.userInfo, {errorShareImg: imgurl})
          that.getUserInfo(that.userInfo)
          console.log(that.userInfo)
        } else if (time === 2) {
          // this.saveImg = res.data.data.imgurl
          console.log(imgurl)
          wx.downloadFile({
            url: imgurl,
            success: function (res) {
              console.log(res)
              console.log(imgurl)
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: function (r) {
                  console.log('授权成功')
                  // console.log(r)
                  console.log(res.tempFilePath)
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (r1) {
                      console.log('保存成功')
                      // console.log(res)
                      wx.hideLoading()
                      wx.showModal({
                        title: '存图成功',
                        content: '发朋友圈可以获取播放',
                        success: function (res) {
                          that.$set(that.curVideo, 'status', 5)
                          that.changeVideo(that.curVideo)
                          that.$http.post('/api/dyapi/shareinfo', {
                            userid: that.userInfo.userid,
                            openid: that.userInfo.openid,
                            videoid: that.curVideo.id,
                            times: that.curVideo.times
                          }).then((res) => {
                            console.log('分享次数增加')
                            that.$set(that.curVideo, 'times', ++that.curVideo.times)
                            that.$set(that.curVideo, 'sc', ++that.curVideo.sc)
                          })
                        }
                      })
                    },
                    fail: function (r1) {
                      console.log(r1)
                      console.log(res.tempFilePath)
                      wx.showToast({
                        title: '保存失败',
                        duration: 2000
                      })
                    }
                  })
                },
                fail: function (r) {
                  console.log('授权失败')
                  wx.hideLoading()
                  wx.openSetting({
                    success: function () {
                      wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (r1) {
                          console.log('保存成功')
                          // console.log(res)
                          wx.hideLoading()
                          wx.showModal({
                            title: '存图成功',
                            content: '发朋友圈可以获取播放',
                            success: function (res) {
                              that.$set(that.curVideo, 'status', 5)
                              that.changeVideo(that.curVideo)
                              that.$http.post('/api/dyapi/shareinfo', {
                                userid: that.userInfo.userid,
                                openid: that.userInfo.openid,
                                videoid: that.curVideo.id,
                                times: that.curVideo.times
                              }).then((res) => {
                                console.log('分享次数增加')
                                that.$set(that.curVideo, 'times', ++that.curVideo.times)
                                that.$set(that.curVideo, 'sc', ++that.curVideo.sc)
                              })
                            }
                          })
                        },
                        fail: function (r1) {
                          console.log(r1)
                          console.log(res.tempFilePath)
                          wx.showToast({
                            title: '保存失败',
                            duration: 2000
                          })
                        }
                      })
                    }
                  })
                }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '下载失败',
                duration: 2000
              })
            }
          })
        } else {
          that.userInfo = Object.assign(that.userInfo, {successShareImg: imgurl})
          that.getUserInfo(that.userInfo)
        }
        console.log(that.userInfo)
      })
    },
    // 拒绝分享重新开始
    refuseShare () {
      this.toggleVideo()
    }
  },

  created () {
  },
  computed: {
    ...mapState([
      'userInfo',
      'questionInfo',
      'curVideo',
      'position'
    ])
  },
  onShow () {
    innerAudioContext.stop()
    if (this.videoContext) {
      this.videoContext.stop()
    }
  },
  onLoad (options) {
    console.log('屏幕高度' + this.screenH)
    const emitter = new EventEmitter()
    emitter.setMaxListeners(0)
    var that = this
    console.log('获取到的传值')
    console.log(options)
    // 检测是否拥有userid
    wx.getStorage({
      key: 'vuex',
      success (res) {
        console.log('缓存存在信息')
        var data = JSON.parse(res.data)
        console.log(data)
        if (data && data.userInfo && data.userInfo.identity && data.userInfo.identity !== '') {
          that.getSystem(false)
          that.userInfo = data.userInfo
        } else {
          that.getSystem(true)
        }
      },
      fail () {
        console.log(that.curVideo)
        console.log('缓存不存在信息')
        that.getSystem(true)
      }
    })
    // 开局倒计时
    var timer = setInterval(function () {
      that.num = that.num - 1
      if (that.num === 0) {
        clearInterval(timer)
      }
    }, 1000)
  },
  onHide () {
    innerAudioContext.stop()
    this.videoContext.stop()
  },
  onShareAppMessage (res) {
    var that = this
    // this.getShareImg(1)
    console.log('图片数据')
    console.log(that.userInfo)
    return {
      title: that.userInfo.nickName + ',邀请你来玩音达人',
      path: '/pages/index/main?obj=' + JSON.stringify(that.curVideo),
      imageUrl: that.curVideo.status === 1 ? that.userInfo.errorShareImg : that.userInfo.successShareImg,
      success () {
        that.curVideo.paused = true
        if (that.curVideo.status === 1) {
          that.$set(that.curVideo, 'status', 4)
        }
        that.$set(that.curVideo, 'paused', true)
        console.log(that.curVideo.paused)
        that.changeVideo(that.curVideo)
        that.$http.post('/api/dyapi/shareinfo', {
          userid: that.userInfo.userid,
          openid: that.userInfo.openid,
          videoid: that.curVideo.id,
          times: that.curVideo.times
        }).then((res) => {
          console.log('分享次数增加')
          that.$set(that.curVideo, 'times', ++that.curVideo.times)
          that.$set(that.curVideo, 'sc', ++that.curVideo.sc)
        })
      }
    }
  }
}
</script>

<style scoped>
  /*倒计时*/
  .countdown{
    font-size: 90px;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    color: #FFF;
    font-weight: bolder;
    background: rgba(0,0,0,.5);
  }
  .countdown p{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    animation: spanScale 1s linear infinite;
  }
  @keyframes spanScale {
    0%{
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
      opacity: 1;
    }
    50%{
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
      opacity: 0.5;
    }
    100%{
      -webkit-transform: scale(1.5);
      -moz-transform: scale(1.5);
      -ms-transform: scale(1.5);
      -o-transform: scale(1.5);
      transform: scale(1.5);
      opacity: 0;
    }
  }
  .box {
    font-size: 0;
    overflow: hidden;
  }
  /*视频*/
  video {
    width: 100%;
    z-index: 2;
    cursor:pointer;
    object-fit: fill;
  }
  .occupy_bitmap{
    width: 100%;
  }
  /*答题状态*/
  .answerStatus {
    width: 100%;
    background: no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
    overflow: hidden;
    position: relative;
  }
  .answerStatus .timing{
    margin-top: 0;
  }
  /*蒙层*/
  .layer {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #FFF;
    /*font-weight: bolder;*/
    /*text-shadow: 1px 1px 1px  rgba(0,0,0,.5);*/
    background: no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
  }
  /*计时*/
  .timing {
    color: #e4e4e4;
    font-size: 24px;
    text-align: center;
    width: 100%;
    letter-spacing: 5px;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  rgba(0,0,0,.5);
    background-image: -webkit-linear-gradient(to bottom,rgba(0,0,0,.3) 10%,rgba(0,0,0,0));
    background-image: linear-gradient(to bottom,rgba(0,0,0,.3) 10%,rgba(0,0,0,0));
    line-height: 31px;
  }
  .success .timing{
    margin-top: 20px;
    margin-bottom: 15px;
    background-image:none;
  }
  /*播放按钮*/
  .play {
    width: 50px;
    height: 55.5px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    z-index: 3;
  }
  /*音频*/
  .audio {
    padding: 16px 16px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    background: rgba(0,0,0,.2);
  }
  .tips {
    font-size: 16px;
    color: #e4e4e4;
    /*font-weight: bolder;*/
    /*text-shadow: 1px 1px 1px  #e4e4e4;*/
    margin-bottom: 9px;
  }
  .audioItem {
    font-size: 0;
    color: #e4e4e4;
    /*font-weight: bolder;*/
    /*text-shadow: 1px 1px 1px  #e4e4e4;*/
    height: 41px;
    width: 100%;
    border-radius: 5px;
    background: rgba(0, 0, 0, .5);
    width: 100%;
    line-height: 41px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }
  /*.audioItem:hover::before {*/
    /*content: '';*/
    /*position: absolute;*/
    /*width: 20px;*/
    /*height: 20px;*/
    /*border-radius: 20px;*/
    /*!*background: rgba(255,0,0,.5);*!*/
    /*top: 11px;*/
    /*left: 150px;*/
    /*animation: btnClick 1s linear forwards;*/
  /*}*/
  /*@keyframes btnClick {*/
    /*0%{*/
      /*background: rgba(255,0,0,0);*/
      /*transform: scale(1);*/
    /*}*/
    /*50%{*/
      /*background: rgba(255,0,0,.3);*/
      /*transform: scale(1.2);*/
    /*}*/
    /*100%{*/
      /*background: rgba(255,0,0,.5);*/
      /*transform: scale(1.5);*/
    /*}*/
  /*}*/
  .logo {
    position: absolute;
    left: 16px;
    height: 41px;
    line-height: 41px;
    display: flex;
    align-items: center;
    z-index: 3;
  }
  .audioItem cover-image,
  .audioItem img{
    width: 11.2px;
    height: 21.6px;
  }
  .audioName {
    font-size: 14px;
    line-height: 41px;
    width: 225px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .progress {
    height: 41px;
    width: 20%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .placeholder {
    font-size: 14px;
    line-height: 41px;
    color: #f0096e;
    font-weight: bold;
  }
  .btnGroup{
    font-size: 12px;
    color: #e4e4e4;
    position: absolute;
    top: 184px;
    right: 12px;
    padding: 50px 0;
    z-index: 3;
  }
  /*按钮组*/
  .btnGroup cover-view{
    margin-top: 4px;
  }
  .btnGroup cover-image:nth-of-type(2){
    margin-top: 20px;
  }
  .btnGroup view {
    font-size: 18px;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  rgba(0,0,0,.5);
  }
  .btnGroup button {
    margin-top:4px;
    display: inline-block;
    padding: 0;
    background: none;
    border: 0;
    line-height: 0;
    font-size: 0;
  }
  /*去除button默认边框*/
  button::after{ border: none; }
  .dot_praise{
    width: 54px;
    height: 50px;
    position: absolute;
    animation: dotScale 1s linear 1;
    animation-fill-mode:forwards;
    z-index: 2;
  }
  .add{
    position: absolute;
    width: 100%;
    font-size: 14px;
    font-weight: bolder;
    color: #f41684;
    top: 30px;
    left: 0;
    text-align: center;
    animation: addOne 1s linear 1;
    animation-fill-mode:forwards;
    z-index: 3;
  }
  @keyframes dotScale {
    0%{
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
    50%{
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
      opacity: 0.5;
    }
    100%{
      -webkit-transform: scale(2);
      transform: scale(2);
      opacity: 0;
    }
  }
  @keyframes addOne {
    0%{
      font-size: 14px;
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
    50%{
      font-size: 16px;
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
      opacity: 0.5;
    }
    100%{
      font-size: 18px;
      -webkit-transform: translateY(-40px);
      transform: translateY(-40px);
      opacity: 0;
    }
  }
  /*失败*/
  .fail{
    padding: 0 16px;
    position: absolute;
    bottom: 55.5px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    background: rgba(0,0,0,.2);
  }
  .fail_tips{
    font-size: 18px;
    color: #FFF;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  rgba(0,0,0,.5);
    margin-bottom: 18px;
  }
  /*成功*/
  .success{
    padding: 0 16px;
    position: absolute;
    bottom: 55.5px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    background: rgba(0,0,0,.2);
  }
  .success_tips{
    font-size: 18px;
    color: #e72e6f;
    margin-bottom: 13px;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  #e72e6f;
  }
  .success .audioItem,
  .fail .audioItem{
    margin-bottom: 0;
  }
  /*向上向下箭头*/
  /*.up,*/
  .down{
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    z-index:3;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .down img{
    width: 23px;
    height: 25.5px;
    position:relative;
    animation: beating 1s linear infinite alternate;
  }
  @keyframes beating {
    0%{
      opacity: 1;
      top: 0;
    }
    50%{
      opacity: 0.8;
      top: 10px;
    }
    100%{
      opacity:0.5;
      top: 10px;
    }
  }
  /*.up{*/
    /*top:13.5px;*/
  /*}*/
  .down{
    bottom: 13.5px;
  }
  /*错误模态框1*/
  .modal_box{
    z-index: 4;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #FFF;
    background: rgba(0,0,0,.5);
  }
  .modal{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 335px;
    height: 325px;
    background: no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .modal .avatar{
    width: 75px;
    height: 75px;
    border-radius: 75px;
    border: 2px solid #fff;
    position: absolute;
    top: 31px;
    left: 51px;
    background:no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .modal .name{
    font-size: 28px;
    color: #fefefe;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  #fefefe;
    position: absolute;
    top: 33px;
    right: 62px;
    transform: rotate(-30deg);
  }
  .modal .share_btn{
    width: 204px;
    height: 60.5px;
    position: absolute;
    bottom: 23px;
    right: 0;
    left: 0;
    margin: auto;
    background: no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
  }
  /*错误模态框2*/
  .modal2{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 335px;
    height: 285px;
    background: no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .modal2 .title{
    position: absolute;
    bottom: 98px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #4bfffa;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  #4bfffa;
  }
  .modal2 .times{
    font-size: 24px;
    color: #fb00ff;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  #fb00ff;
  }
  .modal2 .share_btn{
    width: 204px;
    height: 60.5px;
    position: absolute;
    bottom: 23px;
    right: 0;
    left: 0;
    margin: auto;
    background: no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .refuse{
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: -33px;
    right: 0;
    left: 0;
    margin: auto;
  }
  .two_times{
    width: 254px;
    height: 106px;
    position: absolute;
    top: 30%;
    /*bottom: 0;*/
    left: 0;
    right: 0;
    margin: auto;
  }

</style>
