<template>
  <div id="app">
    <keep-alive>
      <router-view v-if='$route.meta.keepAlive'></router-view>
    </keep-alive>
    <router-view v-if='!$route.meta.keepAlive'></router-view>
  </div>
</template>

<script>

// import Login from './views/login/Login.vue'
export default {
  name: 'App',
  mounted () {

  },
  watch: {
    '$route': function (to, from) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },



}

</script>

<style lang="less" scoped>
@import url("./style/common");
@import url("./style/title");
// #app{
// width: 100vw;
// height: 100vh;
// }
#app {
  width: 100vw;

  // background-color: #f5f3f4;
  background-color: #f8f9fa;

  background-size: cover;
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
