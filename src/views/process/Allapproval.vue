<template>
  <div class="allapproval">
    <div class="head">
      <van-nav-bar
        class="leave"
        fixed
        title="假事审核"
        left-text="返回"
        @click-left="backOn"
        left-arrow
      >
      </van-nav-bar>
    </div>

    <!-- <div v-if="msgArr.length > 0"> -->

    <div>
      <van-pull-refresh
        class="content"
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有啦"
          @load="onLoad"
        >
          <div
            class="conters"
            v-for="item in msgArr"
            :key="item['leave_id']"
            @click="lookMessage(item)"
          >
            <div class="img">
              <i>
                <img
                  :src="item['user_head_url']"
                  alt=""
                  :v-lazy="item['user_head_url']"
                />
              </i>
            </div>

            <div class="conter">
              <div class="conterLeft">
                <p class="partConters">
                  <span :style="{ color: '#00ff00' }">·</span>
                  {{ item.username }}
                </p>

                <p class="partConter">
                  <span :style="{ color: '#00ff00' }">·</span>
                  {{ item.apply_type }}
                </p>

                <p class="partConter">
                  <span :style="{ color: '#00ff00' }">·</span>
                  {{ item["apply_time"] }}
                </p>
              </div>

              <div class="conterRight">
                <div v-if="item['audit_state'] == 0">
                  <div class="child"></div>
                </div>

                <div v-else>
                  <div class="read"></div>
                </div>
              </div>
            </div>
          </div>
        </van-list>

        <!-- <div class="messageNull" v-if="msgArr.length == 0">
                    暂无工作通知
                </div> -->
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "Allapproval",
  data() {
    return {
      loading: false, // 加载数据
      finished: false, //数据完全加载完
      refreshing: false,
      msgArr: [],
      onceArr: [],
      page: "", //页数
      imgs: require("../../assets/imgs/moren.png"), //默认头像
    };
  },

  mounted() {
    //更新当前页数
    this.page = this.page || 1;
  },

  methods: {
    // 时间戳转换成时间
    timestampToTime(time) {
      let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D =
        (date.getDate() + 1 < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      let h =
        (date.getHours() + 1 < 10 ? "0" + date.getHours() : date.getHours()) +
        ":";
      let m =
        date.getMinutes() + 1 < 10
          ? "0" + date.getMinutes()
          : date.getMinutes();
      return Y + M + D + h + m;
      // console.log(timestampToTime (1533293827000))
    },

    //阅读工作通知
    lookMessage(msgId) {
      localStorage.setItem("data", JSON.stringify(msgId));
      this.$router.push({
        path: "/detailsapproval",
        // query:{
        //     data:JSON.stringify(msgId)
        // }
      });
    },

    //无线加载数据更新
    onLoad() {
      this.$axios
        .get({
          url: "/leave/pendingapproval",
          params: {
            page: this.page,
          },
        })
        .then((res) => {
          console.log(res);

          //下拉加载
          if (this.refreshing) {
            this.msgArr = [];
            this.refreshing = false;
          }

          //渲染数据
          if (res && res.data) {
            for (let i = 0; i < res.data.length; i++) {
              //换算时间
              res.data[i]["apply_time"] = this.timestampToTime(
                res.data[i]["apply_time"]
              );

              //设置头像
              if (
                res.data[i]["user_head_url"] == null ||
                res.data[i]["user_head_url"] == ""
              ) {
                res.data[i]["user_head_url"] = this.imgs;
              } else {
                res.data[i]["user_head_url"] =
                  require('../../config').baseURL + "/imgs/temporary/" +
                  res.data[i]["user_head_url"];
              }

              this.msgArr.push(res.data[i]);
              this.msgArr = this.msgArr.reverse();
            }
          }

          //加载完成
          this.loading = false;

          //当前页数
          this.page += 1;

          //数据全部加载完成
          if (this.page > res.pagetotle) {
            this.finished = true;
          } else if (!res.pagetotle) {
            this.finished = true;
          }
        });
    },

    onRefresh() {
      // 清空列表数据
      this.finished = false;

      //page重载为一
      this.page = 1;

      // 重新加载数据
      this.onLoad();

      // console.log(this.data)

      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
    },

    backOn() {
      this.$router.push("/about");
    },
  },
};
</script>

<style scoped lang="less">
.allapproval {
  padding-top: 7vh;
  padding-bottom: 7vh;
  overflow-y: scroll;
  overflow-x: hidden;

  .leave {
    height: 7vh;
  }
}

.conters {
  width: 90%;
  height: auto;
  display: flex;
  align-content: stretch;
  background-color: #fff;
  border-radius: 5px;
  margin: 1vh auto;
  .img {
    flex: 2;
    background-color: #fff;
    border-radius: 5px;
    i {
      display: block;
      width: 3rem;
      height: 3rem;
      border-radius: 3rem;
      background-size: 3rem 3rem;
      border: none;
      margin: calc((100% - 1rem) / 2) auto;
      img {
        width: 3rem;
        height: 3rem;
      }
    }
  }
  .conter {
    flex: 8;
    .partConters {
      padding-top: 0.3rem;
      font-size: 1rem;
    }
    .partConter {
      padding-top: 0.1rem;
      font-size: 0.8rem;
      color: #aaa;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    p {
      margin: 0.4rem 0.16rem;
    }
  }

  .conterLeft {
    float: left;
    width: 65%;
    height: 5rem;
  }

  .conterRight {
    float: right;
    width: 35%;

    //未读
    .child {
      float: right;
      margin-top: 1.2rem;
      margin-right: 1.2rem;
      width: 0.3rem;
      height: 0.3rem;
      background: red;
      border-radius: 5px;
    }

    //已读
    .read {
      float: right;
      margin-top: 1.2rem;
      margin-right: 1.2rem;
      width: 0.4rem;
      height: 0.4rem;
      background: #fff;
      border-radius: 4px;
    }

    .conterRightTime {
      margin-top: 2.5rem;
      clear: right;
      width: 90%;
      text-align: right;
      font-size: 0.1rem;
      color: #9a9a9a;
    }
  }
}

.messageNull {
  margin: 3rem auto;
  width: 80%;
  text-align: center;
  color: #787887;
}
.content {
  height: 100vh;
}
/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>