<template>
  <cover-view class="layer" @click.stop="setDotPraise($event)">
    <cover-image class="down" v-if="curVideo.status == 1 && (position === 1 || position === 2)" src="/static/down_arrow.png"></cover-image>
    <cover-image class="up" v-if="curVideo.status == 1 && (position === 1 || position === 0)" src="/static/up_arrow.png"></cover-image>
    <cover-image class="dot_praise" :style="{top: item.y,left: item.x}" v-for="(item,index) in praise" :key="index" src="/static/dot_praise.png"></cover-image>
    <!--计时器-->
    <cover-view class="timing" :style="{'position':curVideo.status == 1?'absolute':'static'}">{{curVideo.time}}</cover-view>
    <!--播放按钮-->
    <cover-image class="play" src="/static/play_btn.png"></cover-image>
    <!--点赞、分享按钮-->
    <cover-view class="btnGroup" v-if="curVideo.status == 1">
      <cover-view class="add"  v-for="(item, index) in praise" :key="index">+1</cover-view>
      <cover-image :src="curVideo.pc > 0?'/static/dot_praise.png':'/static/no_dot_praise.png'" style="width: 30px;height: 27.5px;"></cover-image>
      <cover-view style="text-align: center;">{{curVideo.pc}}</cover-view>
      <cover-image :src="curVideo.sc > 0?'/static/wechat.png':'/static/share.png'" style="width: 30px;height: 26px;"></cover-image>
      <cover-view style="text-align: center;">{{curVideo.sc}}</cover-view>
    </cover-view>
    <!--选择音乐界面-->
    <cover-view class="audio" v-if="curVideo.status == 0">
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
    <!--选择失败界面-->
    <cover-view class="fail" v-if="curVideo.status == 2">
      <cover-view class="fail_tips">配乐错误。没关系，你还有一次机会</cover-view>
      <cover-view class="audioItem">
        <cover-view class="logo">
          <cover-image src="/static/logo.png"></cover-image>
        </cover-view>
        <cover-view class="audioName">{{playInAudio.name}}</cover-view>
        <cover-view class="progress" :style="{'width':playInAudio.progress}"></cover-view>
      </cover-view>
    </cover-view>
    <!--选择成功界面-->
    <cover-view class="success" v-if="curVideo.status == 1">
      <cover-view class="success_tips">恭喜你，你就是达人！</cover-view>
      <cover-view class="audioItem">
        <cover-view class="logo">
          <cover-image src="/static/logo.png"></cover-image>
        </cover-view>
        <cover-view class="audioName">{{playInAudio.name}}</cover-view>
        <cover-view class="progress" :style="{'width':playInAudio.progress}"></cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
    import {mapActions} from 'vuex'
    // const innerAudioContext = wx.createInnerAudioContext()
    export default {
      props: ['curVideo', 'questionInfo', 'curItem', 'allAudio'],
      data () {
        return {
          allAudio: [], // 所有音频
          praise: [], // 点赞
          playInAudio: {}, // 播放中音频
          timer: '', // 定时器
          videoContext: '', // 视频
          totalClick: 0, // 点击次数
          position: 0 // 当前视频位于 0最前 1中间 2最后 3为只有一个视频
        }
      },
      created () {
        var index = this.questionInfo.findIndex((item) => {
          return item.url === this.curVideo.url
        })
        if (this.questionInfo.length === 1) {
          this.position = 3
        } else if (this.questionInfo.length > 1) {
          if (index === 0) {
            this.position = 0
          } else if (index === this.questionInfo.length - 1) {
            this.position = 2
          } else {
            this.position = 1
          }
        }
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
          'judgeRight',
          'getVideoStatus'
        ]),
        playAudio (item, index) {
          var that = this
          if (item.paused) {
            that.videoContext = wx.createVideoContext('curVideo')
            that.videoContext.seek(0)
            that.videoContext.play()
            this.$emit('setItem', item, this.videoContext, index, this.allAudio)
          } else {
            that.videoContext.pause()
            that.$set(that.curVideo, 'num', ++that.curVideo.num)
            if (item.url === this.curVideo.audiourl.url) {
              this.judgeRight({obj: item, flag: true})
            } else {
              this.judgeRight({obj: item, flag: false})
            }
            console.log(that.curVideo)
            that.getVideoStatus(that.curVideo)
            // innerAudioContext.pause()
            this.playInAudio = item
          }
          console.log(this.curVideo)
        },
        setDotPraise (e) {
          if (this.curVideo.status === 1) {
            if (this.totalClick++ < 5) {
              this.$set(this.curVideo, 'pc', this.curVideo.num++)
              this.getVideoStatus(this.curVideo)
            }
            this.praise.push({x: e.x + 'px', y: e.y + 'px', rotate: (parseInt(Math.random() * 2) === 1 ? 'rotate(30deg)' : 'rotate(-30deg)')})
          }
        },
        changeVideo () {
          // var that = this
          var url = 'http://dy.420csd.com/1.mp4'
          wx.downloadFile({
            url: url,
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              })
              // wx.saveFile({
              //   tempFilePath: res.tempFilePath,
              //   success: function (res) {
              //     console.log(res)
              //     that.curVideo.videourl = res.savedFilePath
              //     wx.showToast({
              //       title: '保存成功',
              //       icon: 'success'
              //     })
              //     // var savedFilePath = res.savedFilePath
              //   }
              // })
            }
          })
        }
      }
    }
</script>

<style scoped>
  /*蒙层*/
  .layer {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #FFF;
  }
  /*计时*/
  .timing {
    color: #e4e4e4;
    font-size: 24px;
    text-align: center;
    width: 100%;
    /*line-height: 48px;*/
    letter-spacing: 5px;
    bottom: 138px;
    margin-top: 12px;
    /*font-weight: bold;*/
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
  }
  /*音频*/
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
    top: 184px;
    right: 12px;
    padding: 50px 0;
  }
  /*按钮组*/
  .btnGroup cover-view{
    margin-top: 4px;
    font-weight: bolder;
    text-shadow: 1px 1px 1px  rgba(0,0,0,.5);
  }
  .btnGroup view{
    font-weight: bolder;
    text-shadow: 1px 1px 1px  rgba(0,0,0,.5);
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
  .add{
    position: absolute;
    width: 100%;
    font-size: 12px;
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
      font-size: 12px;
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
    50%{
      font-size: 14px;
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
      opacity: 0.5;
    }
    100%{
      font-size: 16px;
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
  }
  .fail_tips{
    font-size: 18px;
    color: #FFF;
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
  }
  .success_tips{
    font-size: 18px;
    color: #e72e6f;
    margin-bottom: 13px;
  }
  .success .audioItem,
  .fail .audioItem{
    margin-bottom: 0;
  }
  /*向上向下箭头*/
  .up,.down{
    width: 23px;
    height: 25.5px;
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
  }
  .up{
    top:13.5px;
  }
  .down{
    bottom: 13.5px;
  }
</style>
