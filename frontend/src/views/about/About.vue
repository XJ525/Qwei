<template>
  <div class="about">
    <Nav></Nav>

    <div class="banner">

      <van-swipe :autoplay="3000"
                 class="auto_img">
        <van-swipe-item v-for="(image, index) in images"
                        :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>

      <div class="board">
        <van-notice-bar left-icon="volume-o"
                        background="#1989FA"
                        color="#fff"
                        :text= notice  @click="$router.push('/notice')" />

        
      </div>
    </div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">工作台
    </van-divider>

    <div class="content">
      <van-row>
        <van-col v-for="item in common"
                 :key="item.pid"
                 class="lists"
                 span="6"
                 style="height: 12h;">
          <router-link :to="item.rurl ? item.rurl : '/'">
            <p class="iocn-r"
               style="background-color: rgb(95, 154, 237);">
              <span class="iconmain icon "
                    v-html="item.icon"></span>
            </p>
            <p class="font">{{ item.pname }}</p>
          </router-link>
        </van-col>
      </van-row>

      <van-divider v-if="blogList.length"  :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 1rem' }">管理
      </van-divider>
      <van-row>
        <van-col v-for="item in blogList"
                 :key="item.pid"
                 class="lists"
                 span="6"
                 style="height: 12h;">
          <router-link :to="item.rurl ? item.rurl : '/'">
            <p class="iocn-r"
               style="background-color: rgb(95, 154, 237);">
              <span class="iconmain icon "
                    v-html="item.icon"></span>
            </p>
            <p class="font">{{ item.pname }}</p>
          </router-link>
        </van-col>
      </van-row>

    </div>

    <div>
      <!-- <router-view></router-view> -->
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav.vue";
export default {
  name: "About",
  components: {
    Nav,
  },
  data () {
    return {
      notice: '',
      msg: "",
      blogList: [],    //传过来的权限集
      common: [],
      images: [      //图片集
        require('../../config').baseURL + "/imgs/nav/banner.png",
        require('../../config').baseURL + "/imgs/nav/banner.jpg",
      ],
      ico: [
        ''
      ],
    };
  },
  mounted () {
    console.log(this.$store.state);
    this.$axios
      .get({
        url: "/role/select",
      })
      .then((res) => {

        let obj = {};
        for (let i = 0; i < res.length; i++) {
    
          let key = 'parent_id' + res[i].parent_id;
          // console.log(key);

          if (obj[key]) {
            obj[key].push({
              pid: res[i].pid,
              icon: res[i].icon,
              order_number: res[i].order_number,
              rurl: res[i].rurl,
              pname: res[i].pname
            })
          } else {
            obj[key] = [{
              pid: res[i].pid,
              icon: res[i].icon,
              order_number: res[i].order_number,
              rurl: res[i].rurl,
              pname: res[i].pname
            }]

          }


        }
        this.common = obj['parent_id-1'] ? obj['parent_id-1'] : [];

        this.blogList = obj['parent_id0'] ? obj['parent_id0'] : [];
      });


    this.$axios.get({
      url: 'notice/hisnot',
    }).then(res => {
      if(res.code == '0' && res.data[0].connent) {
        this.notice = res.data[0].connent
      }
      

    })

    // this.$axios
    //   .get({
    //     url: "/power/parent_id_child",
    //     params: {
    //       parentid:0
    //     }

    //   }).then(result => {
    //     this.blogList = result;
    //   })



  },
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: "iconfont1";
  src: url("../../style/font/iconfont.woff2") format("woff2"),
    url("../../style/font/iconfont.woff") format("woff"),
    url("../../style/font/iconfont.ttf") format("truetype");
}
@font-face {
  font-family: "iconfontmain"; /* Project id 2963104 */
  src: url("../../assets/ico/font_2963104_oqcdqp2ta5g/iconfont.woff2")
      format("woff2"),
    url("../../assets/ico/font_2963104_oqcdqp2ta5g/iconfont.woff")
      format("woff"),
    url("../../assets/ico/font_2963104_oqcdqp2ta5g/iconfont.ttf")
      format("truetype");
}
.iconmain {
  font-family: "iconfontmain" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.iconfont {
  font-family: "iconfont1" !important;
  font-size: 1rem;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.banner {
  width: 95%;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  border-radius: 0 0 1rem 1rem;
  //轮播图
  .my-swipe .van-swipe-item {
    width: 100%;
    color: #fff;
    font-size: 1.25rem;
    line-height: 9.375rem;
    text-align: center;
    background-color: #1989fa;
  }
  .auto_img {
    width: 100%;
    height: 25vh;
    img {
      width: 100%;
      height: 25vh;
      // border-radius: 1rem 1rem 0 0;
    }
  }

  .board {
    display: block;
    background-color: #1989fa;
    // padding: 0.1rem;
    color: #fff;
    // font-weight: bold;
    border-radius: 0 0 1rem 1rem;
  }
}

.content {
  margin: 1rem auto;
  width: 95%;
  height: auto;
  overflow: hidden;
  padding-bottom: 9vh;
  // display: flex;

  .icoc {
    display: block;
    text-align: center;
    font-size: 2.5rem;
    color: #1989fa;
  }
  .ftitle {
    display: block;
    text-align: center;
    font-size: 0.8rem;
  }
  .images {
    display: block;
    margin: 0.8rem auto;
    width: 40%;
  }
  .icon {
    font-size: 1.5rem;
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
  .font {
    color: #000;
    text-align: center;
  }
  .itemicon {
    margin: 0 auto;
    // margin-top: 50% - 5.5625rem;
  }
}
</style>
