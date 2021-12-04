<template>
  <div class="face">

    <div v-show="showContainer"
         class="face-capture"
         id="face-capture">
      <video ref="refVideo"
             id="video"
             style="width:100vw; height:100vh">
      </video>
      <img src="./../../assets/img/video-cover.png"
           alt="cover"
           class="img-cover" />
      <div class="control-container face-capture">
        <h2 class="title">{{scanTip}}</h2>
        <img class="close"
             src="./../../assets/img/address_edit_clear.png"
             alt=""
             @click="exit" />
        <canvas ref="refCanvas"
                :width="screenSize.width"
                :height="screenSize.height"
                :style="{opacity: 0}"></canvas>
      </div>
      <div class="rect"
           v-for="(item,key) in profile"
           :key="key"
           :style="{ width: item.width + 'px', height: item.height + 'px', left: item.left + 'px', top: item.top + 'px'}">
      </div>
    </div>
    <canvas ref="refCanvas2"
            :width="screenSize.width"
            :height="screenSize.height"
            style="opacity: 0;display:none;"></canvas>
    <img ref="savedImg"
         v-show="!showContainer"
         :src="imgUrl" />

  </div>
</template>

<script>
require('tracking/build/tracking-min.js')
require('tracking/build/data/face-min.js')
require('tracking/build/data/mouth-min.js')
require('tracking/examples/assets/stats.min.js')


export default {
  name: 'Face',
  components: {
  },
  data () {
    return {
      screenSize: { width: window.screen.width, height: window.screen.height },
      URL: null,
      streamIns: null,        // 视频流
      showContainer: true,   // 显示
      tracker: null,
      tipFlag: false,         // 提示用户已经检测到
      flag: false,            // 判断是否已经拍照
      context: null,          // canvas上下文
      profile: [],            // 轮廓
      removePhotoID: null,    // 停止转换图片
      scanTip: '人脸识别中...',// 提示文字
      imgUrl: ''              // base64格式图片
    }
  }, mounted () {
    this.playVideo()
  },
  methods: {
    // 访问用户媒体设备
    getUserMedia (constrains, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //最新标准API
        navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit内核浏览器
        navigator.webkitGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.mozGetUserMedia) {
        //Firefox浏览器
        navagator.mozGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constrains).then(success).catch(error);
      } else {
        this.scanTip = "你的浏览器不支持访问用户媒体设备"
      }
    },
    success (stream) {
      this.streamIns = stream
      // webkit内核浏览器
      this.URL = window.URL || window.webkitURL
      if ("srcObject" in this.$refs.refVideo) {
        this.$refs.refVideo.srcObject = stream
      } else {
        this.$refs.refVideo.src = this.URL.createObjectURL(stream)
      }
      this.$refs.refVideo.onloadedmetadata = e => {
        this.$refs.refVideo.play()
        this.initTracker()
      }
    },
    error (e) {
      this.scanTip = "访问用户媒体失败" + e.name + "," + e.message
    },
    playVideo () {
      this.getUserMedia({
        video: {
          width: 1920, height: 1080, facingMode: "user"
        }     /* 前置优先 */
      }, this.success, this.error)
    },
    // 人脸捕捉
    initTracker () {
      this.context = this.$refs.refCanvas.getContext("2d")    // 画布
      this.tracker = new tracking.ObjectTracker(['face'])     // tracker实例
      this.tracker.setStepSize(0.4)                           // 设置步长
      this.tracker.on('track', this.handleTracked)            // 绑定监听方法
      try {
        tracking.track('#video', this.tracker)      // 开始追踪
      } catch (e) {
        this.scanTip = "访问用户媒体失败，请重试"
      }
    },
    // 追踪事件
    handleTracked (e) {
      if (e.data.length === 0) {
        this.scanTip = '未检测到人脸'
      } else {
        if (!this.tipFlag) {
          this.scanTip = '检测成功，正在拍照，请保持不动2秒'
        }
        // 1秒后拍照，仅拍一次
        if (!this.flag) {
          this.scanTip = '拍照中...'
          this.flag = true
          this.removePhotoID = setTimeout(() => {
            this.tackPhoto()
            this.tipFlag = true
          }, 2000)
        }
        e.data.forEach(this.plot)
      }
    },
    // 绘制跟踪框
    plot ({ x, y, width: w, height: h }) {
      // 创建框对象
      this.profile.push({ width: w, height: h, left: x, top: y })
    },
    // 拍照
    tackPhoto () {

      try {

        this.context.drawImage(this.$refs.refVideo, 0, 0, this.screenSize.width, this.screenSize.height)
        // 保存为base64格式
        this.imgUrl = this.saveAsPNG(this.$refs.refCanvas)

        this.compare();

      } catch (error) {

        this.Dialog.confirm({
          message: '人脸检测失败。',
          confirmButtonText: '重试'
        })
          .then(() => {
            location.reload();
          })
          .catch(() => {
            this.$router.go(-1);

          });

      }


    },
    // Base64转文件
    getBlobBydataURI (dataURI, type) {
      var binary = window.atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: type
      });
    },
    // compare(url) {
    //     let blob = this.getBlobBydataURI(url, 'image/png')
    //     let formData = new FormData()
    //     formData.append("file", blob, "file_" + Date.parse(new Date()) + ".png")
    //     // TODO 得到文件后进行人脸识别
    // },
    // 保存为png,base64格式图片
    saveAsPNG (c) {
      return c.toDataURL('image/png', 0.3)
    },
    // 关闭并清理资源
    close () {
      this.flag = false
      this.tipFlag = false
      this.showFailPop = false
      this.showContainer = false
      this.tracker && this.tracker.removeListener('track', this.handleTracked)
      this.tracker = null
      this.context = null
      this.profile = []
      this.scanTip = '人脸识别中...'
      clearTimeout(this.removePhotoID)
      if (this.streamIns) {
        this.streamIns.enabled = false
        this.streamIns.getTracks()[0].stop()
        this.streamIns.getVideoTracks()[0].stop()
      }
      this.streamIns = null

      // this.$router.go(0);

    },
    compare () {
      this.Toast.loading({
        message: '人脸录入中...',
        forbidClick: true,
      });

      let base64 = this.imgUrl.split('data:image/png;base64,')[1];
      this.$axios.post({
        url: "/user/face",
        data: {
          face: base64
        }
      }).then(res => {
        console.log(111);
        if (res.code == '0') {
          this.Toast.success("录入成功");
          setTimeout(() => {
            this.$router.replace('/myshow/faces');
          }, 3000)
        } else {
          this.Toast.fail('录入失败，请重试');
          setTimeout(() => {
            this.$router.go(0);
          }, 3000)


        }


      })







    },
    exit () {
      this.close();

      this.$router.replace('/myshow/faces')



    }
  }

}
</script>
<style lang="less" scoped>
.face {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  font-size: 37.5px;
  color: white;
}
.face-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.face-capture video,
.face-capture canvas {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.face-capture canvas {
  z-index: 2;
}

.face-capture .img-cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.face-capture .rect {
  border: 2px solid #0aeb08;
  position: fixed;
  z-index: 3;
}

.face-capture .control-container {
  margin-top: 23.4375rem;
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 4;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.face-capture .title {
  text-align: center;
  color: white;
  margin: 1.6rem auto;
  font-size: 18px;
}

.face-capture .close {
  position: relative;
  width: 2rem;
  height: 2rem;
  z-index: 3;
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>
