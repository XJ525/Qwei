<template>

  <div class="message">

    <div class="head">
      <van-nav-bar title="站内信"
                   left-text="返回"
                   right-text="历史记录"
                   fixed
                   class="title"
                   left-arrow
                   @click-left="$router.replace('/')"
                   @click-right="myhistory">

      </van-nav-bar>
    </div>

    <div v-if="msgArr.length > 0">

      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">

        <div class="conters"
             v-for="(item) in msgArr"
             :key="item['message_id']"
             @click="lookMessage(item['message_id'])">

          <div class="img">
            <i>
              <img :src="`${item['user_head_url']}`" alt="">
            </i>
          </div>

          <div class="conter">
            <div class="conterLeft">

              <p>
                <span :style="{ color: '#00ff00'}">·</span>
                {{ item.username }}
              </p>
              <p class="partConter">
                {{ item.content }}
              </p>

            </div>

            <div class="conterRight">
              <div v-if="item['read_state'] == 0">
                <div class="child"> </div>
              </div>

              <div v-else>
                <div class="read"> </div>
              </div>

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
      没有消息记录
    </div>
    <van-button
      icon="plus"
      type="info"
      :round="true"
      class="issues createFile"
       @click="createFile"
    ></van-button>
    


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
        url: 'message/recemsg',
      }).then(
        res => {
            if (res.code == 0) {
                for (let x = 0; x < res.data.length; x++) {
                    res.data[x]['message_time'] = this.timestampToTime(res.data[x]['message_time'])
                    res.data[x]['user_head_url'] = require('../../config').baseURL + '/imgs/temporary/' + res.data[x]['user_head_url']
                    this.msgArr = res.data.reverse()
                    this.listTotal = res.list
                }

            } else {
                // this.Toast.fail()
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
      // console.log(event.currentTarget, msgId)
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
                      res.data[x]['user_head_url'] = require('../../config').baseURL + '/imgs/temporary/' + res.data[x]['user_head_url']
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

    myhistory() {
      this.$router.push('./message/messagehistory')
    }


  }
}
</script>

<style lang="less" scoped>
.conters {
  width: 100%;
  height: auto;
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
    .partConter {
      font-size: 0.8rem;
      width: 80%;
      color: #aaa;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    p {
      margin: 0.4rem 5px;
    }
  }

  .conterLeft {
    float: left;
    width: 65%;
    height: 4rem;
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
      width: 0.4rem;
      height: 0.4rem;

      background: red;
      border-radius: 4px;
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
      font-size: 0.2rem;
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

.issues {
  position: fixed;
  font-size: 1rem;
  width: 3rem;
  height: 3rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  top: 78vh;
  border-radius: 10rem;
  background-color: cornflowerblue;
  border: none;
  z-index: 999;
}
.message {
  width: 100%;
  min-height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 7vh;
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

