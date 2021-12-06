<template>
    <div class="notice">
        <div class="head">
            <van-nav-bar title="公告栏"
                        left-text="返回"
                        left-arrow
                        fixed
                        class="titlenotice"
                        @click-left="$router.replace('/')">
            </van-nav-bar>
        </div>

        <div class="main">

            <div class="nowNotice" v-if="noticeAll.length > 0">
                <div>
                    <h4 class="noticeTitle">
                        {{ newNotice['title'] }}
                    </h4>
                </div>
                <div>
                    <p class="nowContent">
                        {{ newNotice['connent'] }}
                    </p>
                    <div class="noticeMsg">
                        <p class="nowTime">
                        {{ newNotice['create_time'] }}
                        </p>
                        <p class="nowPeop">
                            发布人：<span> {{ newNotice['username'] }} </span>
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <van-divider
                    :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
                    >
                    以往公告
                </van-divider>
            </div>

            
            
                <div class="mainNoticeAll">
                        <van-list v-model="loading"
                    :finished="finished"
                    finished-text="到底啦"
                    @load="onLoad">

                        <div class="oldNotice"
                        v-for="(item, index) in noticeAll" :key="index"
                        @click="cutNotice(item)"
                        >
                            <van-cell-group inset>
                                <van-cell 
                                :title="` ${noticeAll[index]['title']}`"
                                :label="`${noticeAll[index]['connent']}`"
                                >
                                    <!-- <> {{ noticeAll[index]['connent'] }} </i> -->
                                    <span class="userRelease">
                                        {{ noticeAll[index]['username'] }} 发布于
                                    </span>
                                    <span class="tineRelease">
                                        {{ noticeAll[index]['create_time'] }}
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
    name: 'Notice',
    data () {
        return {
            noticeAll: [],      //历史所有公告
            newNotice: {},      //最新一条公告
            finished: true,    //无限加载
            loading: false,
            listTotal: '',      //总条数
        }
    },
    mounted () {
        this.rander()
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
                url: 'notice/hisnot'
            }).then(
                res => {
                  console.log(res);
                    if (res.code == 0) {
                        for (let x = 0; x < res.data.length; x++) {
                            res.data[x]['create_time'] = this.timestampToTime(res.data[x]['create_time'])
                        }
                        this.listTotal = res.pagetotle;
                        this.noticeAll = res.data;
                        this.newNotice = this.noticeAll[0];
                    } else {
                        console.log(res.message)
                    }
                    this.finished = false
                    this.Toast.clear();
                }
            )
        },

        //切换公告
        cutNotice (data) {
            this.newNotice = data
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
        onLoad() {

            this.$axios.get({
                url: 'notice/hisnot',
                params: {
                    page: this.noticeAll.length
                }
            }).then(
                res => {
                    if (res && res.code == 0) {
                        this.loading = false;
                        for (let x = 0; x < res.data.length; x++) {
                            this.noticeAll.push(res.data[x])
                        }
                    // 数据全部加载完成
                    } else {
                        if (this.noticeAll.length >= this.listTotal) {
                            this.finished = true;
                        }
                    }
                }
            )
        },


    },

}
</script>

<style lang="less" scoped>



.notice {

    padding-top: 7vh;

    .main {
        width: 100%;
        height: auto;
        .nowNotice {
            // position: fixed;
            margin: 2rem auto;
            padding: 1rem;
            overflow: hidden;
            width: 70%;
            min-height: 5rem;
            border: 2px solid #676fe6;
            border-radius: 0.8rem;
            background-color: #fff;
            .noticeTitle {
                text-align: center;
            }
        }

        .oldNotice {
            margin: 1rem auto;
            width: 100%;
            height: auto;
            overflow: hidden;
        }

        .mainNoticeAll {
            width: 100%;
            height: 30rem;
            overflow-x: auto;
        }
    }
}

.nowNotice {
    h4 {
        margin-block-start: 0.8em;
        margin-block-end: 0.8em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }
    .nowTime {
        float: right;
        margin-block-end: 0.8em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-size: 0.8rem;
    }
    .nowPeop {
        float: left;
        margin-block-start: 0.8em;
        margin-block-end: 0.8em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-size: 0.8rem;
    }
    .noticeMsg {
        width: 100%;
        height: auto;
    }
}

.oldNotice {
    .userRelease {
        display: block;
    }

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

    // .tineRelease {

    // }
}

.titlenotice {
    height: 7vh;
}


/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}


</style>