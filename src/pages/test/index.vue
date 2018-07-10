<template>
  <div style="height: 200px;">
    <div style="font-size: 20px;color: red;">{{privacy}}</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        privacy: ''
      }
    },
    onLoad () {
      var that = this
      wx.login({
        success: function (res) {
          that.privacy = '2222'
          that.$http.post('https://api.weixin.qq.com/sns/jscode2session?appid=wxb6fe85452d18daba&secret=4f6d2b2382613f13a9e6ea9eef4e9b18&js_code=' + res.code + '&grant_type=authorization_code', {}).then(function (res) {
            console.log(res)
            that.privacy = '1111'
            // that.shareImg = JSON.stringify(that.userInfo)
            // console.log(that.shareImg)
          }).catch((res) => {
            console.log(res)
            that.privacy = '3333'
          })
        }
      })
    }
  }
</script>

<style scoped>

</style>
