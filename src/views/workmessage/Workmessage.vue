<template>
  <div class="workmsg">
    <div class="head">

      <van-nav-bar v-if="flag == true"
                   title="工作通知"
                   left-text="返回"
                   left-arrow
                   right-text="发布通知"
                   @click-left="$router.replace('/about')"
                  
                   @click-right="$router.push('/workmessage/workmessagesend')" />
                   

      <van-nav-bar v-else title="工作通知"
                   left-text="返回"
                   left-arrow
                   @click-left="$router.replace('/')">
                   

      </van-nav-bar>
    </div>

    <div class="workmsgmain"
         v-if="workmessageAll.length > 0">

      <div class="mainNoticeAll">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="到底啦"
                  @load="onLoad">

          <div class="oldNotice"
               v-for="(item, index) in workmessageAll"
               :key="index"
               @click="lookMessage(item['message_id'])">

            <van-cell-group inset>
              <van-cell :title="`${item['username']}`"
                        :label="`${item['content']}`">

                <span class="tineRelease">
                  {{ item['message_time'] }}
                </span>
              </van-cell>
            </van-cell-group>
          </div>

        </van-list>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Workmessage',
  data () {
    return {
      workmessageAll: [],    //历史所有公告
      finished: true,    //无限加载
      listTotal: '',      //总条数
      loading: false,
      flag:false,
    }
  },
  mounted () {
    this.rander();
    this.$axios.get({
      url: '/role/select',
    }).then(res => {
      for (let x = 0; x < res.length; x++) {
        if (res[x].pid == 37) {
          this.flag = true;

        }
      }

    })
  },

  methods: {

    //渲染
    rander () {
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 10000
      });
      this.$axios.get({
        url: 'workmessage/workrecemsg'
      }).then(
        res => {
          if (res.code == 0) {
            for (let x = 0; x < res.data.length; x++) {
              res.data[x]['message_time'] = this.timestampToTime(res.data[x]['message_time'])
            }
            this.listTotal = res.listTotle;
            this.workmessageAll = res.data.reverse();
          } else {
            console.log(res.message)
          }
          if (this.workmessageAll.length < this.listTotal) {
            this.finished = false           //启动无限加载
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
      let D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate())
      return Y + M + D
      // console.log(timestampToTime (1533293827000))
    },

    //无限加载
    onLoad () {
      this.$axios.post({
        url: '',
        data: {
          page: this.workmessageAll.length
        }
      }).then(
        res => {
          if (res && res.code == 0) {
            this.loading = false;
            for (let x = 0; x < res.data.length; x++) {
              this.msgArr.push(res.data[x])
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

    //阅读工作通知
    lookMessage (msgId) {
      this.$router.push(`/workmessage/workmessagesee?msgid=${msgId}`)
      // console.log(event.currentTarget, msgId)
    },
  }

}
</script>

<style lang="less" scoped>
.workmsg {
  width: 100%;
  height: 100%;
  overflow: hidden;

  // background-color: red;

  .workmsgmain {
    width: 100%;
    height: 47.8rem;
    overflow-x: auto;
  }

  .oldNotice {
    margin: 1rem auto;
    width: 100%;
    height: auto;
    overflow: hidden;
    .van-cell__label {
      display: block;
      font-size: 0.8rem;
      width: 80%;
      color: #aaa;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
</style>
