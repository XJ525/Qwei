<template>
  <div class="uppasd">
    <van-nav-bar title="修改密码"
                 left-text="返回"
                 left-arrow
                 class="head"
                 @click-left="onClickLeft" />
    <div class="box">
      <van-field v-model="password"
                 type="password"
                 class="pasinput"
                 placeholder="请输入当前密码"
                 label="当前密码" />
      <van-field v-model="newpassword"
                 type="password"
                 class="pasinput"
                 placeholder="请输入新密码密码"
                 label="新密码" />
      <van-field v-model="verifypassword"
                 type="password"
                 class="pasinput"
                 placeholder="请输入新密码密码"
                 label="确认密码" />
      <van-button v-if="password != '' && newpassword != '' && verifypassword != ''"
                  @click="uppassword"
                  class="btn"
                  type="info">修改密码</van-button>
      <van-button v-else
                  class="btn"
                  disabled
                  type="info">修改密码</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: "",
      newpassword: "",
      verifypassword: "",
    };
  },
  methods: {
    onClickLeft () {
      this.$router.push({
        path: "/myshow",
      });
    },
    uppassword () {
      //判断原密码是否与新密码一致
      if (this.password == this.newpassword) {
        this.Toast({
          message: "新密码不能与原密码一致",
          position: "bottom",
        });
        return;
      }
      if (this.newpassword != this.verifypassword) {
        this.Toast({
          message: "新密码不一致",
          position: "bottom",
        });
        return;
      }
      this.$axios
        .post({
          url: "/user/psd",
          data: {
            oldpasd: this.password,
            newpasd: this.newpassword,
          },
        })
        .then((res) => {
          if (res.code == 0) {
            //修改成功



            // this.Toast.success("修改成功");

            this.Toast.loading({
              message: "密码已修改，请重新登陆...",
              forbidClick: true,
              duration: 0,
            });

            setTimeout(() => {
              localStorage.removeItem("token");
              this.$router.push({
                path: "/login",
              });
            }, 2000);
          } else if (res.code == "-2") {
            //原密码错误
            this.Toast({
              message: "原密码错误",
              position: "bottom",
            });
          } else if (res.code == "-11") {
            //挤出
            this.$router.push({
              path: "/login",
            });
            this.Toast.loading({
              message: "检测到您的账号在异地登陆...",
              forbidClick: true,
              duration: 0,
            });
          } else {
            //修改失败
            this.Toast.fail("修改失败");
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.head {
  padding: 0.4rem;
}

.box {
  margin: 0 auto;
  width: 85%;

  .pasinput {
    font-size: 1rem;
    padding-top: 1rem;
  }

  .btn {
    width: 100%;
    margin-top: 3rem;
    border-radius: 4rem;
  }
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>

