<template>
  <div id="app">
    
    <!-- <van-button type="info">主要按钮</van-button>
    <van-icon name="fire-o" color="#ee0a24" /> -->
   <router-view />
  </div>
</template>

<script>

// import Login from './views/login/Login.vue'
export default {
  name: 'App',
  mounted(){
    
  },
  watch:{
    '$route':function(to,from){
　    document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },
  

  
}

</script>

<style lang="less" scoped>

  @import url('./style/common');
  @import url('./style/title');
// #app{
// width: 100vw;
// height: 100vh;
// }
#app{
  width: 100vw;

  // background-color: #f5f3f4;
  background-color: #f8f9fa;
  
  background-size:cover;
}
 
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
