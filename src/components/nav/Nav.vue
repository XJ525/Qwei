<template>
  <div class="nav">
  <van-tabbar route class="tabar">
    <van-tabbar-item replace to="/" class="iconfont icon-shouye-shouye index"><span>主页</span></van-tabbar-item>
    <van-tabbar-item replace to="/about" class="iconfont icon-gongzuo1 work"><span>工作</span></van-tabbar-item>
    <van-tabbar-item replace to="/myshow"  class="iconfont icon-wode my"><span>我的</span></van-tabbar-item>
  </van-tabbar>
    
  </div>
</template>

<style scoped lang="less">
@import url("../../style/font/iconfont.css"); //引入ico小图标
@font-face {
  font-family: "iconfont";
  src: url("../../style/font/iconfont.woff2") format("woff2"),
    url("../../style/font/iconfont.woff") format("woff"),
    url("../../style/font/iconfont.ttf") format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
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
    line-height: 3vh;
    span {
     
      font-size: 1rem;
    }
   
  }

  .work {
    line-height: 3vh;
     span {
      font-size: 1rem;
      
    }
    
  }

  .my {
      font-size: 2.5rem;
      line-height: 2vh;
    
     span {
      font-size: 1rem;
    }

    
  }
}


</style> 
    
