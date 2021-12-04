<template>
  <div class="clockbox">
    <van-nav-bar title="考勤打卡"
                 left-text="返回"
                 left-arrow
                 @click-left="$router.go(-1)" />

    <div ref="AMap"></div>
    <van-cell-group class="top clock"
                    inset>
      <van-cell center
                class="head"
                title="上班08:30" />
      <van-cell center
                title="下班17:30" />
    </van-cell-group>
    <div class="content"
         @click="clock">
      <p>
        <span class="p-span">{{ state }}</span>
        <span class="p-span">{{ time }}</span>

      </p>

    </div>
    <div class="cell-group">

      <van-cell-group class="top lists"
                      inset>
        <van-cell center
                  title="打卡记录" />
        <div class="box_list">

          <div class="clock-list"
               v-for="(item,key) in datas"
               :key=key>
            <van-cell v-if="key==0 && item != '当日没有打卡记录'"
                      center
                      :title=item.substr(-8)
                      value="上班打卡" />

            <van-cell v-else-if="key==1"
                      center
                      :title=item.substr(-8)
                      value="下班打卡" />
            <van-cell v-else-if="key>=2"
                      center
                      :title=item.substr(-8)
                      value="更新打卡" />

           

          </div>
           <div class="contentdiv" v-if="datas.length && datas[0] == '当日没有打卡记录'" > {{ datas[0] }} </div>

        </div>

      </van-cell-group>

    </div>
    <ClockNav data="clock"> </ClockNav>

  </div>

</template>

<script>
import ClockNav from '../../components/nav/ClockNav.vue'


export default {
  name: "Clock",
  data () {
    const self = this;
    return {
      list: [1, 2, 3, 4],
      loading: true,
      finished: true,
      'finished-text': '',
      time: '',
      datas: [],
      AMap: null,
      position: {},
      state: '上班打卡'
    }
  },
  methods: {
    timeinit: function () {
      this.time = this.stampChangehHonurs();
      setTimeout(() => {
        this.time = this.stampChangehHonurs();
        this.timeinit();
      }, 1000)

    },
    stampChangehHonurs: function () {
      let hou = new Date().getHours();
      let min = new Date().getMinutes();
      let sec = new Date().getSeconds();
      return `${this.add0(hou)}:${this.add0(min)}:${this.add0(sec)}`;
    },
    add0 (m) { return m < 10 ? '0' + m : m },
    async clock () {
      let flag = false;
      console.log(44545);
      await new Promise((resolve, reject) => {
        this.o.getCurrentPosition((status, result) => {
          console.log(result);
          if (result && result.position) {
            self.lng = result.position.lng;
            self.lat = result.position.lat;
            self.center = [self.lng, self.lat];
            self.loaded = true;


            if (result.info == 'SUCCESS') {
              flag = true;
            }
            resolve()
            // self.$nextTick();
          }
        });
      })
      let data = center;
      if (flag) {
        this.$axios.post({
          url: "/punch_card/check",
          data: {
            location: JSON.stringify({
              lngs: data[0],
              lats: data[1]
            })
          }
        }).then(res => {
          if (res && res.code) {
            this.getdata();
            if (res.code == '-4') {
              this.Dialog.alert({
                title: '打卡失败',
                message: '不在打卡范围内。',
              })

            } else if (res.code == '0' || res.code == '1') {
              this.Dialog.alert({
                title: '打卡成功',
              })

            }

          }
        })
      }
    },
    getdata () {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.$axios.get({
        url: '/check/mycheck',
        params: {
          starT: new Date(`${year}-${month}-${day} 0:0:0`).getTime(),
          endT: new Date(`${year}-${month}-${day + 1} 0:0:0`).getTime() - 1
        }
      }).then(res => {
        this.Toast.clear();
        let ds = Object.keys(res)[0];

        if (res[ds].code == '-2') {
          this.datas = ['当日没有打卡记录']
          return;
        }
        let arr = [];

        if (res[ds].message.length == 1) {
          this.state = '下班打卡'
        } else if (res[ds].message.length > 1) {
          this.state = '更新打卡'
        }
        // arr.push(res[ds].message[0]);
        // arr.push(res[ds].message[res[ds].message.length - 1]);
        // this.datas = arr;
        for (let i = res[ds].message.length - 1; i >= 0; i--) {
          arr.push(res[ds].message[i])
        }
        console.log(arr);
        this.datas = arr;

      })
    },
    async clock () {
      let AMap = this.AMap;
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 1000000
      });
      function myPosition (foo) {
        return new Promise((resolve, reject) => {
          let a = {};
          var map = new AMap.Map('container', {
            resizeEnable: true
          });
          AMap.plugin('AMap.Geolocation', async function () {
            var geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：5s
              buttonPosition: 'RB',    //定位按钮的停靠位置
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

            });
            map.addControl(geolocation);
            await geolocation.getCurrentPosition(function (status, result) {
              if (status == 'complete') {
                a['lat'] = result.position.lat;
                a['lng'] = result.position.lng;
                onComplete(result)
              } else {
                reject()

              }
            });
          });
          //解析定位结果
          function onComplete (data) {

            var str = [];
            // console.log(data.position)
            str.push(data.position);
            resolve(str)
            // str.push('定位类别：' + data.location_type);
          }
          //解析定位错误信息
        })

      }
      let _this = this;

      let position = {};
      await myPosition().then(res => {
        let lats = res[0].lat;
        let lngs = res[0].lng;
        position['lats'] = lats;
        position['lngs'] = lngs;
        _this.position = position;
        _this.$axios.post({
          url: "/punch_card/check",
          data: {
            location: JSON.stringify(position)
          }
        }).then(res => {
          if (res && res.code) {
            _this.Toast.clear();
            if (res.code == '-4') {
              _this.Dialog.alert({
                title: '打卡失败',
                message: '不在打卡范围内。',
              })

            } else if (res.code == '0' || res.code == '1') {
              _this.getdata()
              _this.Dialog.alert({
                title: '打卡成功',
              })

            }

          }
        })
      },
        err => {
          _this.Toast.clear();

          _this.Dialog.alert({
            title: '定位失败',
            message: '请刷新再试',
          })


        }

      )

    }


  },
  mounted: function () {
    this.timeinit();
    this.getdata();
    this.Toast.loading({
      message: "",
      forbidClick: true,
      duration: 10000
    });
    let script = document.createElement('script');
    script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=d2de3b8aae1f6005cabc3872c6fc1fd1';
    this.$refs.AMap.appendChild(script);
    script.onload = () => {
      this.AMap = AMap;
      this.Toast.clear();

    }


  },
  components: {
    ClockNav,

  }
};
</script>

<style lang="less"  scoped >
.clockbox {
  width: 100vw;
  height: 92vh;
  overflow: hidden;
  // padding-top: 8vh;
  .top {
    margin-top: 1.875rem;
    // .head {
    //   // height: 5rem;
    // }
  }
}
.content {
  margin: 1.5rem auto;
  margin-bottom: 0;
  width: 12rem;
  height: 12rem;
  background-color: #1989fa;
  border-radius: 50rem;
  text-align: center;
  line-height: 10rem;
  span {
    display: block;
    width: 100%;
    height: 20px;
    color: #fff;
    margin-top: 0.9375rem;
    font-size: 1.25rem;
  }
}
.rows {
  height: 5vh;
  // border: 1px solid red;
  background: #fff;
}

.cell-group {
  text-align: center;
  height: auto;
  overflow: hidden;
  // border-radius: 50px 50px;
}
.clock-list {
  width: 80%;
  // height: ;
  overflow: auto;
}
.box_list {
  height: 20vh;
  overflow: auto;
  border-radius: 5rem;
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
.contentdiv {
  width: 200px;
  margin: 0 auto;
}
</style>