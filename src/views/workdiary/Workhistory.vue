
<template>
  <div class="workhistory">
    <div class="head">
      <van-nav-bar
        title="历史日志"
        fixed
        left-text="返回"
        @click-left="backOn"
        left-arrow
      >
      </van-nav-bar>
    </div>

    <!-- <div v-if="msgArr.length > 0"> -->

    <div class="contents">
      <van-pull-refresh
        class="content"
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="text"
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
                <p class="dutym">
                  <span class="dutyperson">负责人：</span>
                  <span class="duty"> {{ item.username }} </span>
                </p>

                <p class="logcontent">
                  <span>内容：</span>
                  <span> {{ item["log_content"] }} </span>
                </p>

                <p class="partConter">
                  <span>提交时间：</span>
                  <span> {{ item["log_time"] }} </span>
                </p>
              </div>

              <div class="conterRight">
                <div class="read" v-if="item['log_read_state'] == '已批阅'">
                  {{ item["log_read_state"] }}
                </div>

                <div class="child" v-else>{{ item["log_read_state"] }}</div>
              </div>
            </div>
          </div>
        </van-list>

        <div class="nocentent" v-show="Noleave">暂无提交日志</div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: "Workhistory",
  data() {
    return {
      loading: false, // 加载数据
      finished: false, //数据完全加载完
      refreshing: false,
      msgArr: [],
      page: "", //页数
      imgs: require("../../assets/imgs/moren.png"), //默认头像
      Noleave: false,
      text: "已经到底了",
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

      return Y + M + D;
      // console.log(timestampToTime (1533293827000))
    },

    //无线加载数据更新
    onLoad() {
      this.$axios
        .get({
          url: "/worklog/historyworklog",
          params: {
            page: this.page,
          },
        })
        .then((res) => {
          // console.log(res);

          if (res && res.code == -405) {
            this.Noleave = true;
            this.text = "";
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
                  require("../../config").baseURL +
                  "/imgs/temporary/" +
                  res.data[i]["user_head_url"];
              }

              //设置状态
              if (res.data[i].log_read_state == 0) {
                res.data[i].log_read_state = "未批阅";
              } else {
                res.data[i].log_read_state = "已批阅";
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
          // console.log(this.page , res.pageOverall)
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

    backOn() {
      this.$router.push({
        path: "/workdiary",
      });
    },

    lookworkapproval(msgId) {
      console.log(msgId);
      localStorage.setItem("data", JSON.stringify(msgId));
      this.$router.push({
        path: "/myworkdetails",
      });
    },
  },
};
</script>

<style scoped lang="less">
.contents {
  padding-top: 7vh;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.dutyperson {
  font-size: 1rem;
}

.conters {
  width: 90%;
  height: auto;
  display: flex;
  align-content: stretch;
  background-color: #fff;
  // border: 1px solid rgb(196, 195, 195);
  border-radius: 0.1rem;
  margin: 0.1rem auto;

  .img {
    flex: 2;
    background-color: #fff;
    border-radius: 2rem;
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
    .dutym {
        padding-top: 0.3rem;
    }

  .conter {
    flex: 8;
    .partConter {
      font-size: 0.7rem;
      padding-top: 0.2rem;
      color: #aaa;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .logcontent {
      width: 50vw;
      padding-top: 0.3rem;
      color: #aaa;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-size: 1rem;
    }

    p {
      margin: 0.4rem 5px;
    }
  }

  .conterLeft {
    float: left;
    width: 65%;
    height: 6rem;
    overflow: hidden;
  }

  .conterRight {
    float: right;
    width: 35%;
    height: 100%;

    //待审核
    .child {
      float: right;
      text-align: center;
      width: 100%;
      height: 100%;
      line-height: 6rem;
      color: #f2cc8f;
      font-weight: bold;
    }

    //已读
    .read {
      width: 100%;
      height: 100%;
      text-align: center;
      background: #fff;
      line-height: 6rem;
      font-weight: bold;
      color: #52b788;
    }

    .noread {
      width: 100%;
      height: 100%;
      text-align: center;
      background: #fff;
      line-height: 6rem;
      font-weight: bold;
      color: rgb(177, 62, 27);
    }
  }
}

.messageNull {
  margin: 3rem auto;
  width: 80%;
  text-align: center;
  color: #787887;
}

// .content {
//     height: 100vh;

// }

// /deep/.van-pull-refresh{
//         overflow: none;
//
.nocentent {
  width: 100%;
  height: 10vh;
  color: #000;
  line-height: 10vh;
  text-align: center;
  font-weight: bold;
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>