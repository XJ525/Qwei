<template>
  <div class="logins">
    <keep-alive>
      <component :is="change"></component>
    </keep-alive>
    <div v-if="change=='LoginPsd'">
       <p @click="change='LoginCodes'">验证码登录</p>
    </div>
    <div v-else>
      <p @click="change='LoginPsd'">密码登录</p>
    </div>

    <p class="agreement ">
       <!-- <el-radio v-model="flag" label="1">我已阅读并同意服务协议和隐私政策</el-radio> -->
    </p>

    
   
  </div>
</template>


<script>
import LoginPsd from "./LoginPsd.vue";
import LoginCodes from "./LoginCodes.vue";

export default {
  name: "Login",

  data() {
    return {
      change: "LoginCodes",
      flag:false,
    };
  },
  components: {
    LoginCodes,
    LoginPsd,
  },
};
</script>

<style lang="less"  scoped >
@font-color:#888;
.logins {
  height: 100vh;
  overflow: hidden;
}
p {
  display: block;
  margin: 0.8rem auto;
  width: 80%;
  color: @font-color;
}
.agreement {
  position: fixed;
  bottom: 2rem;
  left: 0;
  text-align: center;
}
</style>