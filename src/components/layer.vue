<template>
  <cover-view class="layer" @click.stop="setDotPraise($event)">
    <cover-image class="dot_praise" :style="{top: item.y,left: item.x}" v-for="(item,index) in praise" :key="index" src="/static/dot_praise.png"></cover-image>
    <!--计时器-->
    <cover-view class="timing">{{curVideo.time}}</cover-view>
    <!--播放按钮-->
    <cover-image class="play" src="/static/play_btn.png"></cover-image>
    <cover-view class="btnGroup">
      <cover-image src="/static/no_dot_praise.png" style="width: 30px;height: 27.5px;"></cover-image>
      <cover-view>5156</cover-view>
      <cover-image src="/static/share.png" style="width: 30px;height: 26px;"></cover-image>
      <cover-view>1268</cover-view>
    </cover-view>
    <cover-view class="audio">
      <cover-view class="tips">请选择正确的配乐</cover-view>
      <cover-view class="audioItem" v-for="(item, index) in allAudio" @click.stop="playAudio(item, index)" :key="index">
        <cover-view class="logo">
          <cover-image src="/static/logo.png"></cover-image>
        </cover-view>
          <cover-view class="audioName" v-if="item.paused">{{item.name}}</cover-view>
          <cover-view class="progress" :style="{'width':item.progress}"></cover-view>
          <cover-view class="placeholder" v-if="!item.paused">确认</cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
    import {mapActions} from 'vuex'
    const innerAudioContext = wx.createInnerAudioContext()
    export default {
      props: ['curVideo'],
      data () {
        return {
          allAudio: [],
          praise: []
        }
      },
      created () {
        var curVideo = this.curVideo.otheraudio.slice(0)
        curVideo.splice(parseInt(Math.random() * 4), 0, this.curVideo.audiourl).concat()
        this.allAudio = curVideo
        this.allAudio.map((item) => {
          item.paused = true
          item.progress = '0%'
        })
        console.log(this.allAudio)
      },
      methods: {
        ...mapActions([
          'judgeRight'
        ]),
        playAudio (item, index) {
          var that = this
          var time = this.curVideo.time.split(':')
          if (item.paused) {
            var curItem = Object.assign(item, {paused: false})
            that.$set(that.allAudio, index, curItem)
            item.paused = false
            innerAudioContext.autoplay = true
            innerAudioContext.src = item.url
            var videoContext = wx.createVideoContext('curVideo')
            videoContext.seek(0)
            videoContext.play()
            innerAudioContext.onPlay(() => {
              console.log('开始播放')
              this.allAudio.map((item1) => {
                item1.paused = true
                item1.progress = '0%'
                if (item.url === item1.url) {
                  item1.paused = false
                }
              })
              // 计时
              setInterval(() => {
                time = this.curVideo.time.split(':')
                var min = time[0]
                var sec = time[1]
                var msec = time[2]
                if ((parseInt(time[2]) + 15 + '').length === 2) {
                  msec = '0' + (parseInt(time[2]) + 10)
                } else {
                  msec = (parseInt(time[2]) + 15)
                  if (parseInt(msec) > 1000) {
                    msec = '000'
                    if ((parseInt(sec) + 1 + '').length === 1) {
                      sec = '0' + (parseInt(sec) + 1)
                    } else {
                      sec = parseInt(sec) + 1
                      if (parseInt(sec) > 60) {
                        sec = '00'
                        if ((parseInt(min) + 1 + '').length === 1) {
                          min = '0' + (parseInt(min) + 1)
                        } else {
                          min = parseInt(min) + 1
                        }
                      }
                    }
                  }
                }
                that.$set(that.curVideo, 'time', min + ':' + sec + ':' + msec)
                console.log(that.curVideo)
              }, 15)
            })
            innerAudioContext.onTimeUpdate(() => {
              console.log(innerAudioContext.currentTime)
              // this.curVideo
              var curProgress = Object.assign(item, {progress: innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%'})
              that.$set(that.allAudio, index, curProgress)
              // console.log(item)
              // item.progress = innerAudioContext.currentTime / innerAudioContext.duration * 100 + '%'
              // console.log(item.progress)
            })
          } else {
            if (item.url === this.curVideo.audiourl.url) {
              this.judgeRight(item)
            }
          }
        },
        setDotPraise (e) {
          console.log(e)
          // var that = this
          this.praise.push({x: e.x + 'px', y: e.y + 'px', rotate: (parseInt(Math.random() * 2) === 1 ? 'rotate(30deg)' : 'rotate(-30deg)')})
          // setTimeout(function () {
          //   if (that.praise.length && that.praise.length > 1) {
          //     that.praise.shift()
          //   }
          // }, 1000)
        }
      }
    }
</script>

<style scoped>
  .layer {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #FFF;
  }

  .timing {
    color: #e4e4e4;
    font-size: 24px;
    text-align: center;
    width: 100%;
    line-height: 48px;
    letter-spacing: 5px;
    /*font-weight: bold;*/
  }

  .play {
    width: 50px;
    height: 55.5px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }

  .audio {
    padding: 0 16px;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .tips {
    font-size: 12px;
    color: #e4e4e4;
    margin-bottom: 9px;
  }

  .audioItem {
    font-size: 0;
    color: #e4e4e4;
    height: 41px;
    width: 100%;
    border-radius: 5px;
    background: rgba(0, 0, 0, .3);
    width: 100%;
    line-height: 41px;
    margin-bottom: 18px;
    position: relative;
    overflow: hidden;
  }

  .logo {
    position: absolute;
    left: 12px;
    height: 41px;
    line-height: 41px;
    display: flex;
    align-items: center;
    z-index: 3;
  }

  .audioItem cover-image {
    width: 21px;
    height: 24px;
  }

  .audioName {
    font-size: 14px;
    line-height: 41px;
  }

  .progress {
    height: 41px;
    width: 20%;
    background: rgba(255, 255, 255, .5);
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
    top: 234px;
    right: 12px;
  }
  .btnGroup cover-view{
    margin-top: 4px;
  }
  .btnGroup cover-image:nth-of-type(2){
    margin-top: 20px;
  }
  .dot_praise{
    width: 30px;
    height: 27.5px;
    position: absolute;
    animation: dotScale 1s linear 1;
    animation-fill-mode:forwards;
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
</style>
