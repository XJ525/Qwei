<template>
  <div class="myshow">
    <Nav></Nav>

    <div class="header">
      <div class="top_img">
        <img v-lazy="imgsrc" />
      </div>
      <div class="info">
        <h2>{{ username }}</h2>
        <p>{{ name }}</p>
      </div>
      <div class="icos">
        <van-icon name="arrow"
                  class="rig_ico"
                  size="20"
                  @click="tomsg" />
      </div>
    </div>
    <div class="card">
      <!-- 第一组 -->
      <van-cell-group inset
                      class="grid">
        <router-link to="/myshow/feedback">
          <van-cell class="griding">
            <van-icon class="ico back"
                      size="22"
                      name="smile-comment" />
            <p>意见反馈</p>
          </van-cell>
        </router-link>

        <router-link to="/myshow/uppsd">
          <van-cell class="griding">
            <van-icon class="ico alt"
                      size="22"
                      name="lock" />
            <p>修改密码</p>
          </van-cell>
        </router-link>
      </van-cell-group>
      <!-- 第二组 -->
      <van-cell-group inset
                      class="grid">
        <router-link to="/myshow/faces">
          <van-cell class="griding">
            <van-icon class="ico face"
                      size="22"
                      name="smile" />
            <p>人脸采集</p>
          </van-cell>
        </router-link>

        <van-cell @click="showPopup"
                  class="griding">
          <van-icon class="ico out"
                    size="22"
                    name="setting" />
          <p>退出登录</p>
        </van-cell>
      </van-cell-group>

      <!-- 退出登录确认框 -->
      <van-popup v-model="show"
                 position="bottom"
                 :style="{ height: '25%' }">
        <van-cell-group @click="logout"
                        title=" ">
          <van-cell class="pop outstyle"
                    :center="true"
                    input-align="center">
            <p class="outlogin"
               style="text-align: center; color: red; font-size: 1.2rem">
              退出
            </p>
          </van-cell>
        </van-cell-group>
        <van-cell-group @click="off"
                        title=" "
                        input-align="center">
          <van-cell class="pop outstyle">
            <p style="text-align: center">取消</p>
          </van-cell>
        </van-cell-group>
      </van-popup>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav.vue";

export default {
  name: "Myshow",
  components: {
    Nav,
  },
  data () {
    return {
      username: "",
      name: "",
      fileList: [],
      imgsrc: "",
      show: false,
    };
  },
  methods: {
    tomsg () {
      //跳个人信息页
      this.Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      this.$router.push({
        path: "/myshow/msg",
      });
    },
    showPopup () {
      //退出登录弹出层
      this.show = true;
    },
    logout () {
      //确认退出登录
      this.Toast.loading({
        message: "退出中...",
        forbidClick: true,
      });

      this.$axios
        .get({
          url: "user/logout",
        }).then(res => {
          if (res && res.code == '12') {
            localStorage.removeItem("token");
            this.$router.push({
              path: "/login",
            });
            this.Toast.clear();
          } else {
            this.Toast.fail('退出失败')
          }
        })




    },
    off () {
      //取消退出登录
      this.show = false;
    },
  },
  mounted () {
    //
    this.$axios
      .get({
        url: "/user/mymessage",
      })
      .then((res) => {
        // console.log(res);
        if (res.code == "1") {
          this.username = res.message.username;
          this.name = res.message.name;
          this.job = res.message.job_name;

           let user_head_url = res.message.user_head_url ? res.message.user_head_url : 'head.png'
          this.imgsrc =
            require('../../config').baseURL + "/imgs/temporary/" + user_head_url;
          // if (res.message.user_head_url) {
          //   this.imgsrc =
          //     "http://localhost:3000/imgs/temporary/" +
          //     res.message.user_head_url;
          // } else {
          //   this.imgsrc = "../../assets/img/header.png";
          // }

          // console.log(this.imgsrc)
          //请求成功
        } else if (res.code == "-6") {
          this.Toast.fail("未查询到该用户的信息");
          //未请求到数据，该用户不存在
          return;
        } else if (res.code == "-2") {
          this.Toast.fail("未获取到数据,请重试");
          //请求失败
          return;
        } else if (res.code == "-500") {
          //挤出登录
          // localStorage.removeItem('token');
          //  this.Toast.loading({
          //   message: "检测到您的账号在异地登录，如不是您本人操作，请尽快修改密码或冻结账户...",
          //   forbidClick: true,
          //   duration: 5000,
          // });
          // this.$router.push({
          //     path: "/login",
          // });
          // this.Toast.clear();
          return;
        }
      });
  },
};
</script>

<style lang="less" scoped>
@import url("../../style/common.less");

.header {
  padding: 10vh 0 5vh 0.5rem;
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
  .top_img {
    width: 70px;
    height: 70px;
    // background-color: #c8c9cc;
    float: left;
    img {
      width: 100%;
      height: 100%;
    }
    // border-radius: 5rem;
    // border: chocolate 1px solid;
    & > .van-uploader__preview {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .rig_ico {
    color: #adb5bd;
  }

  .info {
    float: left;
    padding-left: 1.5rem;
    p {
      padding-top: 0.5rem;
      color: #888;
    }
  }
  .outlogin {
    text-align: center;
    color: red;
    font-size: 1.2rem;
  }
  .icos {
    float: right;
    line-height: 9vh;
  }
  .cellcon {
    width: 90%;
    margin: 1rem auto;
  }
}

.card {
  width: 90%;
  margin: 1rem auto;
  .back {
    color: #6b9ac4;
  }
  .alt {
    color: #b0d0d3;
  }
  .face {
    color: #97d8c4;
  }
  .out {
    color: #64b5f6;
  }
  .grid {
    margin-top: 2rem;
    .griding {
      padding: 1rem;
      background-color: #eaeaea;
      // background-color: #dee2e6;
      font-size: 1rem;
      font-weight: bolder;
      .ico {
        float: left;
      }
      p {
        float: left;
        padding-left: 1rem;
        color: #6c757d;
      }
      .pop {
        display: block;
        width: 100%;
        margin: 2rem 0 0.2rem 0;
        text-align: center;
        background-color: #1989fa;
        padding: 1rem;

        p {
          font-size: 2rem;
        }
      }
    }
  }
  .outstyle {
    padding: 1rem;
    text-align: center;
  }
}
</style>


