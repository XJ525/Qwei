<template>
  <div class="nav">
  <van-tabbar route>
    <van-tabbar-item replace to="/clock" class="iconfont icon-dingwei index"><span>定位</span></van-tabbar-item>
    <van-tabbar-item replace to="/facematch" class="iconfont icon-renlian work"><span>人脸</span></van-tabbar-item>
    <van-tabbar-item replace to="/stat"  class="iconfont icon-tongji my"><span>统计</span></van-tabbar-item>
  </van-tabbar>
    
  </div>
</template>

<style scoped lang="less">
@import url("../../assets/ico/font_lcip2d9lqkr/iconfont.css"); //引入ico小图标
@font-face {
  font-family: "iconfont3";
  src: url("../../assets/ico/font_lcip2d9lqkr/iconfont.ttf") format("woff2"),
    url("../../style/font/iconfont.woff") format("woff"),
    url("../../assets/ico/font_lcip2d9lqkr/iconfont.ttf") format("truetype");
}
.iconfont {
  font-family: "iconfont3" !important;
  font-size: 1.6rem;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@width: 100%;
@height: 9vh;
.acss {
    flex: 1;
    display: block;
    text-align: center;
    color: black;
    line-height: @height;
    height: @height;
}

.nav {
  width: @width;
  height: @height;
  border-top: 1px solid rgb(220, 226, 220);
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: white;

  a.router-link-exact-active {
    color: #1989FA;
  }

  .index {
     font-size: 1.8rem;
    line-height: 3vh;
    span {
     
      font-size: 1rem;
    }
   
  }

  .work {
     font-size: 2.1rem;
    line-height: 3vh;
     span {
      font-size: 1rem;
      
    }
    
  }

  .my {
      font-size: 1.8rem;
      line-height: 3vh;
    
     span {
      font-size: 1rem;
    }

    
  }
}
</style> 
    
