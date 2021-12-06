<template>

  <div class="messagehistory">

    <div class="head">
      <van-nav-bar title="我的历史记录"
                   left-text="返回"
                   fixed
                   class="title"
                   left-arrow
                   @click-left="$router.replace('/message')">

      </van-nav-bar>
    </div>

    <div v-if="msgArr.length > 0">

      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">

        <div class="conters"
             v-for="(item) in msgArr"
             :key="item['message_id']">

          <div class="img">
            <i>
              <img :src="`${item['user_head_url']}`" alt="">
              <!-- <img :src="item['user_head_url']"
                   alt=""> -->
            </i>
          </div>

          <div class="conter">
            <div class="conterLeft">

              <p>
                <span :style="{ color: '#00ff00'}">·</span>
                <b>我发至：</b>
                <i>
                  {{ item['GROUP_CONCAT(oao_user_detailed.username)'] }}
                </i>
              </p>
              <p class="partConter">
                {{ item.content }}
              </p>

            </div>

            <div class="conterRight">

              <div class="conterRightTime">
                {{ item['message_time'] }}
              </div>
            </div>
          </div>
        </div>

      </van-list>


    </div>

    <div class="messageNull"
         v-else>
      暂无工作通知
    </div>
    


  </div>

</template>

<script>
export default {
  name: 'Maessage',
  data () {
    return {
      loading: false,
      finished: true,   //无线加载
      msgArr: [],       //所有消息
      listTotal: '',     //总条数
    }
  },

  mounted () {  
    this.rander();
  },

  methods: {
    //页面渲染
    rander () {
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 0
      });
      this.$axios.get({
        url: 'message/myhistoryrmsg',
      }).then(
        res => {
          console.log(res)
            if (res.code == 0) {
                for (let x = 0; x < res.data.length; x++) {
                    res.data[x]['message_time'] = this.timestampToTime(res.data[x]['message_time'])
                    this.msgArr = res.data.reverse()
                    this.listTotal = res.list
                }

            } else {
              
                console.log(res.message)
            }
            if (this.msgArr.length < this.listTotal) {
              this.finished = false;
            }
            this.Toast.clear();

        }
      )
    },

    // 时间戳转换成时间
    timestampToTime (time) {
      let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h = (date.getHours() + 1 < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m = (date.getMinutes() + 1 < 10 ? '0' + date.getMinutes() : date.getMinutes())
      return Y + M + D + h + m
      // console.log(timestampToTime (1533293827000))
    },

    //阅读工作通知
    lookMessage (msgId) {
      this.$router.push(`/message/messagedetinfo?msgid=${msgId}`)
    },
    
    //无限加载
    onLoad() {
        this.$axios.post({
            url: 'message/history',
            data: {
                page: this.msgArr.length
            }
        }).then(
            res => {
                if (res && res.code == 0) {
                    this.loading = false;
                    for (let x = 0; x < res.data.length; x++) {
                      res.data[x]['message_time'] = this.timestampToTime(res.data[x]['message_time'])
                      this.msgArr.push(res.data[x])
                    }
                    if (this.msgArr.length >= this.listTotal) {
                      this.finished = true;
                    }
                // 数据全部加载完成
                } else {
                    if (this.msgArr.length >= this.listTotal) {
                        this.finished = true;
                    }
                }
            }
        )
    },


    createFile () {
        this.$router.push('/message/messagesend')
    },

  }
}
</script>

<style lang="less" scoped>


.messageNull {
  margin: 3rem auto;
  width: 80%;
  text-align: center;
  color: #787887;
}

.messagehistory {
  width: 100%;
  padding-top: 7vh;
  .conters {
  width: 100%;
  height: 9rem;
  display: flex;
  align-content: stretch;
  background-color: #fff;
  .img {
    flex: 2;
    background-color: #fff;
    i {
      display: block;
      margin: 0.4rem auto;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      border-radius: 2.8125rem;
      overflow: hidden;
      background-size: 3rem 3rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .conter {
    flex: 8;
    

    p {
      margin: 0.4rem 5px;
    }
  }

  .conterLeft {
    float: left;
    width: 65%;
    height: 4rem;
    b {
      font-size: 0.8rem;
    }
    i {
      display: block;
      padding: 0.3rem;
      width: 80%;
      height: 2rem;
      font-size: 0.8rem;
      overflow-x: hidden;
    }
    .partConter {
      display: block;
      font-size: 0.8rem;
      width: 140%;
      height: 4rem;
      color: #aaa;
      overflow-x: hidden;
    }
  }

  .conterRight {
    float: right;
    width: 35%;


    .conterRightTime {
      margin-top: 0.4rem;
      clear: right;
      width: 90%;
      text-align: left;
      font-size: 0.2rem;
      color: #9a9a9a;
    }
  }
  }
}

.title {
  height: 7vh;
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}

</style>

