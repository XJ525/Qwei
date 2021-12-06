<template>
  <div class="login">
    <div class="logins">
      <h2>登录</h2>
      <div class="phone">
        <van-field
          v-model="username"
          placeholder="请输入手机号"
          type="tel"
          label="手机号"
          class="inp"
        />
      </div>
      <div class="psd">
        <van-field
          v-model="password"
          placeholder="请输入密码"
          type="password"
          label="密码"
          class="inp"
        />
      </div>

      <van-button
        v-if="username != '' && password != ''"
        @click="loginpsd"
        type="info"
        >登录</van-button
      >

      <van-button v-else disabled type="info">登录</van-button>
    </div>
  </div>
</template>
<script>
import until from "../../untils/index";
import axios from "../../untils/http";

export default {
  name: "LoginCode",

  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    loginpsd() {
      //手机号格式验证
      if (!until.checkPhone(this.username)) {
        this.Toast.fail("手机号不符合格式");
        return;
      }
      this.Toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });

      //登陆验证
      this.$axios
        .post({
          url: "/user/login",
          data: {
            phone: this.username,
            userpawd: this.password,
          },
        })
        .then(
          (res) => {
            if (res.code == "10") {
              //登录成功
              this.Toast.clear();
              this.$router.push({
                path: "/",
              });
              return;
            } else if (res.code == "-11") {
              //电话号码或密码错误
              this.Toast.clear();
              this.Toast.fail("用户名或密码错误");
              return;
            } else if (res.code == '-403') {
              this.Toast.clear();
              this.Toast.fail("账户已被冻结，请联系管理员处理");
            } else {
               this.Toast.clear();
              this.Toast.fail("登陆失败，请稍后再试");

            }
          },
          (err) => {
            this.Toast.fail("登陆失败");
          }
        );
    },
  },
  mounted() {
    this.Toast.clear();
  },
};
</script>


<style lang="less" scoped >
.logins {
  width: 90%;
  margin: 0 auto;
  padding-top: 3rem;
}
.logins h2 {
  padding-bottom: 2rem;
  text-align: center;
}
.inp {
  font-size: 1rem;
}
.logins > button {
  width: 100%;
  height: 3rem;
  margin: 1.5rem auto 0 auto;
  border-radius: 2rem;
  font-size: 1rem;
}
.logins .phone {
  padding-top: 1rem;
}

.logins .psd {
  padding-top: 1rem;
}
</style>