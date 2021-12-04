<template>
  <div class="workapproval">
    <div class="head">
      <van-nav-bar
        title="日志审核"
        left-text="返回"
        fixed
        class="title"
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
          :finished-text="context"
          @load="onLoad"
        >
          <div
            class="conters"
            v-for="item in msgArr"
            :key="item['leave_id']"
            @click="lookworkapproval(item)"
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
                <p>
                  <span :style="{ color: 'black', fontSize:'1rem' }">员工名称:</span>
                  {{ item.username }}
                </p>

                
                <p class="logcontent">
                  <span :style="{ color: '#aaa' }">日志内容:</span>
                  {{ item.log_content }}
                </p>

                <p class="partConter">
                  <span :style="{ color: '#aaa' }">提交时间:</span>
                  {{ item["log_time"] }}
                </p>

              </div>

              <div class="conterRight">
                <div v-if="item['log_read_state'] == 0">
                  <div class="child"></div>
                </div>

                <div v-else>
                  <div class="read"></div>
                </div>
              </div>
            </div>
          </div>
        </van-list>

        <div class="messageNull" v-if="msgArr.length == 0">暂无日志</div>
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
      context: "到底了！",
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
    lookworkapproval(msgId) {
      localStorage.setItem("data", JSON.stringify(msgId));
      this.$router.push({
        path: "/workdetails",
      });
    },

    //无线加载数据更新
    onLoad() {
      this.$axios
        .get({
          url: "/worklog/everoneworklog",
          params: {
            page: this.page,
          },
        })
        .then((res) => {
          console.log(res);

          if (res && res.code == -100) {
            this.loading = false;
            this.finished = true;
            this.context = "";
            // return
          }
          //下拉加载
          if (this.refreshing) {
            this.msgArr = [];
            this.refreshing = false;
          }

          //渲染数据
          if (res && res.data) {
            for (let i = 0; i < res.data.length; i++) {
              //换算时间
              res.data[i]["log_time"] = this.timestampToTime(
                res.data[i]["log_time"]
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
          if (this.page > res.pageOverall) {
            this.finished = true;
          } else if (!res.pageOverall) {
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

      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
    },

    //返回
    backOn() {
      this.$router.push("/about");
    },
  },
};
</script>

<style scoped lang="less">
.workapproval {
    padding-top: 7vh;
    padding-bottom: 1vh;

    .title {
        height: 7vh;
    }
}



.message {
  height: 100vh;
  overflow: hidden;
}

.conters {
  width: 90%;
  height: auto;
  display: flex;
  align-content: stretch;
  background-color: #fff;
//   border: 1px solid rgb(196, 195, 195);
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
      overflow: hidden;
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
    .partConter {
      font-size: 0.8rem;
      color: #aaa;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .logcontent {
      width: 11.25rem;
      padding-top: 0.3rem;
      color: #aaa;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    p {
      margin: 0.4rem 5px;
    }
  }

  .conterLeft {
    float: left;
    width: 65%;
    height: 5rem;
    overflow: hidden;
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
  height: auto;
}


/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>