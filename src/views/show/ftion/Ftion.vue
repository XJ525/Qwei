<template>
  <div id="ftion">
    <van-row class="top">
      <van-col span="24">
        <van-col span="1"></van-col>
        <van-col span="4">
          <img
            class="logo"
            src="../../../assets/nav/logo.png"
            alt=""
            srcset=""
          />
        </van-col>
        <van-col span="1"></van-col>
        <van-col span="17">
          <van-col span="24" class="title_oa"> OA </van-col>
          <van-col span="24" class="title_o"> 一种新型办公方式 </van-col>
        </van-col>
        <!-- <van-col span="3"></van-col> -->
      </van-col>
    </van-row>

    <van-row class="content">
      <van-col span="6" @click="$router.push('/clock')">
        <p class="iocn-r" style="background-color: rgb(95, 154, 237)">
          <span class="iconfont icon">&#xe610;</span>
        </p>
        <p class="font">打卡</p>
      </van-col>
      <van-col span="6" @click="$router.push('/process')">
        <p class="iocn-r" style="background-color: rgb(211, 42, 33)">
          <span class="iconfont icon">&#xe60a;</span>
        </p>
        <p class="font">申请</p>
      </van-col>

      <van-col span="6" @click="$router.push('/message')">
        <p class="iocn-r" style="background-color: rgb(126, 208, 110)">
          <span class="iconfont icon">&#xec35;</span>
        </p>
        <p class="font">消息</p>
      </van-col>
      <van-col span="6" @click="$router.push('/notice')">
        <p class="iocn-r" style="background-color: rgb(132, 112, 255)">
          <span class="iconfont icon">&#xe600;</span>
        </p>
        <p class="font">公告</p>
      </van-col>
    </van-row>
  </div>
</template>

<style scoped lang="less">
@width: 100%;
@height: 30vh;
@height2: 70vh;

#ftion {
  width: @width;
  height: @height;
  // border: 1px solid rgb(54, 52, 52);
  color: darkgrey;
  margin: 0px auto;
  .top {
    padding: 1rem;
    height: 10vh;
    background-color: #fff;
    border-bottom: 1px solid #e1ecf7;
    // border: red 1px solid;
  }
  .content {
    padding-top: 2rem;
  }
  .icon {
    font-size: 30px;
  }
  .iocn-r {
    margin: 0 auto;
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    text-align: center;
    line-height: 3rem;

    color: #fff;
  }
  p.font {
    text-align: center;
  }
  @font-face {
    font-family: "iconfont"; /* Project id 2961810 */
    src: url("../../../assets/ico/font_2961810_btt08qg9iys/iconfont.woff2")
        format("woff2"),
      url("../../../assets/ico/font_2961810_btt08qg9iys/iconfont.woff")
        format("woff"),
      url("../../../assets/ico/font_2961810_btt08qg9iys/iconfont.ttf")
        format("truetype");
  }
}
.logo {
  height: 9vh;
  padding-top: 1vh;
}
.title {
  height: 4.5vh;
}

.title_oa {
  font-size: 1.2rem;
  padding-top: 1rem;
  font-weight: bold;
}
.title_o {
  font-size: 0.5rem;
  padding-top: 0.5rem;
}
</style>