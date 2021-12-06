<template>
  <div class="box">
    <!-- 头部 -->
    <van-sticky :offset-top="0">
      <div class="head">
        <van-nav-bar
          title="人像采集"
          left-text=""
          left-arrow
          class="nav"
          @click-left="onClickLeft"
        />
      </div>
    </van-sticky>

    <!-- 内容 -->
    <div class="content">
      <p>人脸录入</p>
      <div class="picture">
        
        <img class="faceimg" v-if="face !=''" :src="face" alt="" />
        <img class="faceimg" v-else src="../../assets/img/faces.png" alt="" />
      </div>
      <van-button round class="info" @click="$router.push('/face')"
        >{{ info }}</van-button
      >
      <div class="btnifo">
        提示:录入时关闭美颜效果,在正常光线下拍摄，否则影响识别准确率。
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      face: "",
      info:'开始录入'
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/myshow",
      });
    },
  },
  mounted() {
    this.Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });
    this.$axios
      .get({
        url: "/user/face_date",
      })
      .then((res) => {
        console.log(res);
        if (res.data && res.data.user_face) {
           this.face = "data:image/png;base64," + res.data.user_face;
           this.info = '重新录入'
        } 
        this.Toast.clear();
      });
  },
};
</script>

<style lang="less" scoped>
.nav /deep/ .van-ellipsis {
  color: black !important;
  font-size: 1.2rem;
  line-height: 5vh;
  height: 5vh;
}

.box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  text-align: center;
  background-color: #64a4ed;
}

.content {
  margin: 1rem auto;
  width: 95%;
  height: 80vh;
  border-radius: 1rem;
  background-color: #fff;

  p {
    text-align: center;
    font-size: 1.2rem;
    padding: 0.8rem;
    color: #1989fa;
  }

  .picture {
    margin: 0.5rem auto;
    padding: 0.8rem;
    width: 80%;
    height: auto;
    border-radius: 0.6rem;
    border: #e1e5f2 1px solid;
    box-shadow: 0px 0px 1px #000;

    img {
      width: 17.9375rem;
      height: 17.9375rem;
      border-radius: 0.6rem;
      border: #c0d6df 1px solid;
    }
  }
}

.info {
  margin-top: 1rem;
  text-align: center;
  width: 95%;
  height: 7.5vh;
  line-height: 7.5vh;
  font-size: 1.2rem;
  background-color: #1989fa;
  color: #fff;
  border-radius: 5rem;
}

.btnifo {
  padding: 1rem;
  margin: 0 auto;
  text-align: left;
  color: red;
  width: 95%;
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>