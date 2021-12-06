<template>
  <div class="login">
    <div class="logins">
      <h2>登录</h2>

      <div class="phone">
        <van-field v-model="userphone"
                   type="tel"
                   placeholder="请输入手机号"
                   label="手机号"
                   class="inp" />
      </div>

      <div class="code">
        <van-field v-model="usercode"
                   class="inp"
                   clearable
                   label="验证码"
                   placeholder="请输入短信验证码">
          <template #button>
            <van-button v-if="downcode <= 0"
                        class="getco"
                        size="small"
                        plain
                        hairline
                        type="info"
                        @click="getcode">
              发送验证码</van-button>
            <van-button v-else
                        size="small"
                        type="default"
                        class="seconed">{{ downcode }}秒</van-button>
          </template>
        </van-field>

        <!-- <div v-if="downcode <= 0" class="getco" @click="getcode">
          获取验证码
        </div>
        <div v-else class="getco">{{ downcode }}秒</div> -->
      </div>
      <van-button v-if="userphone != '' && usercode != ''"
                  type="info"
                  @click="enter">登录</van-button>

      <van-button v-else
                  disabled
                  type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
import until from "../../untils/index";
import axios from "../../untils/http";

export default {
  name: "LoginCode",

  data () {
    return {
      dialogVisible: false,
      downcode: 0,
      userphone: "",
      usercode: "",
      login: "",
    };
  },
  methods: {
    getcode () {
      // 验证是否有填写手机号
      if (!this.userphone) {
        this.Toast.fail("请填写手机号");
        return;
      }
      //验证手机号格式是否正确
      if (!until.checkPhone(this.userphone)) {
        this.Toast.fail("请填写正确的手机号");
        return;
      }
      //发送验证码
      //验证码验证

      this.$axios
        .post({
          url: "/sms/kcode",
          data: {
            phone: this.userphone,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            //成功发送验证码
            this.Toast.success("验证码发送成功");
          } else if (res.code == "-20") {
            //错误的手机号
            this.Toast.fail("请输入正确的手机号");
            return;
          } else if (res.code == "-25") {
            //用户不存在
            this.Toast.fail("该用户未注册,请到相关部门完成注册");
            return;
          } else if (res.code == '-403') {
            this.Toast.clear();
            this.Toast.fail("账户已被冻结，请联系管理员处理");
          } else {
            this.Toast.clear();
            this.Toast.fail("登陆失败，请稍后再试");

          }

          //倒计时
          this.downcode = 60;

          let verify = () => {
            setTimeout(() => {
              this.downcode--;
              verify();
            }, 1000);
          };
          verify();
        });
    },
    enter () {
      //手机号格式验证
      if (!until.checkPhone(this.userphone)) {
        this.Toast.fail("手机号不符合格式");
        return;
      }
      this.Toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 5000,
      });
      //登陆验证
      this.$axios
        .post({
          url: "/user/verif_login",
          data: {
            phone: this.userphone,
            verif: this.usercode,
          },
        })
        .then((res) => {
          //10 登录成功  -15验证失败
          // console.log(res);
          if (res.code == 10) {
            this.Toast.clear();
            this.$router.push({
              path: "/",
            });
            return;
          } else if (res.code == -15) {
            this.Toast.fail("验证码有误");
            return;
          }else if (res.code == -403) {
            this.Toast.fail("账号已被冻结");
            return;
          }else if (res.code == -405) {
            this.Toast.fail("账号不存在");
            return;
          } else {
            this.Toast.fail("登陆失败，请稍再试");

          }
        });
    },
  },
  mounted () {
    this.Toast.clear();
  },
};
</script>

<style lang="less" scoped>
// 父级 /deep/ .van-ellipsis{ color: red !important; }

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

.logins .code {
  padding-top: 1rem;
}

.seconed {
  border: none;
  font-size: 1rem;
}
</style>