<template>
    <div class="detInfo">
        <div class="head">
            <van-nav-bar title="站内信详情" fixed class="title" left-text="返回"   @click-left="backOn" left-arrow>
            </van-nav-bar>
        </div>


        <div class="onceArrStyle" v-if="onceArr.length > 0">

            <div class="messageConters">
            
                <div class="img">
                    <i>
                        <img :src="`${onceArr[0]['user_head_url']}`" alt="">
                        <!-- <img src="../../assets/img/文件.png" alt=""> -->
                    </i>
                </div>

                <div class="conter">
                <div class="conterLeft">

                    <p>
                        <span class="usernameStyle">{{ onceArr[0]['username'] }}</span>  
                        
                    </p>
                    <p class="messageEnd">
                        <span>发至</span> <b>我</b>   <span class="messagetime">{{ onceArr[0]['message_time'] }}</span>
                    </p>
                
                </div>
                </div>
            </div>

            
            <van-divider  :style="{ color: '#aecbeb', borderColor: '#aecbeb', padding: '0 16px' }"  />

            <div class="mainConter">

                {{ onceArr[0]['content'] }}

            </div>

        </div>


        <div v-else class="messageNull">
            <van-loading color="#0094ff" />

        </div>



    </div>

</template>


<script>
export default {
    name: 'Messagedetinfo',
    data () {
        return {
            data: [],
            onceArr: []
        }
    },

    mounted () {
        
        this.getMessageDet(this.$route.query.msgid);
    },

    methods: {

        getMessageDet (msgId) {
            this.$axios.post({
                url: 'message/setreadstate',
                data: {
                    msgId
                }
            }).then(
                res => {
                    console.log(res)
                    
                    if (res && res.code == 0) {
                        res.data[0]['user_head_url'] = require('../../config').baseURL + '/imgs/temporary/' + res.data[0]['user_head_url']
                        res.data[0]['message_time'] = this.timestampToTime(res.data[0]['message_time'])
                        this.onceArr = res.data;
                    } else {
                        console.log(res.message)
                    }
                }
            )
        },

        timestampToTime (time) {
            let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
            let D = (date.getDate()+1 < 10 ? '0'+ date.getDate() : date.getDate()) + ' '
            let h = (date.getHours()+1 < 10 ? '0'+ date.getHours() : date.getHours()) + ':'
            let m = (date.getMinutes()+1 < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':'
            let s = (date.getSeconds()+1 < 10 ? '0'+ date.getSeconds() : date.getSeconds())
            return Y+M+D+h+m+s
            // console.log(timestampToTime (1533293827000))
        },

        backOn() {

            this.$router.push('/message')
        },
    }

}
</script>

<style scoped lang="less">

.detInfo {
    width: 100%;
    padding-top: 7vh;
    height: 100vh;
    background-color: #f8f9fa;

    .messageNull {
        margin: 3rem auto;
        width: 80%;
        text-align: center;
        color: #787887;
    }
}


.messageConters {
        width: 100%;
        height: auto;
        display: flex;
        padding-top: 0.5rem;
        align-content: stretch;
        background-color: #f8f9fa;
        
        .img {
            flex: 2;
            i {
                display: block;
                margin: 0.4rem auto;
                width: 3rem;
                height: 3rem;
                border: 1px solid #000;
                border-radius: 3rem;
                overflow: hidden;
                background-size: 3rem 3rem;
                background-color: #fff;
                img {
                    width: 100%;
                }
            }
        }
        .conter {
            flex: 8;
            .partConter {
                font-size: 0.8rem;
                color: #aaa
            }

            p {
                margin: 0.4rem 5px;
            }
        }

        .usernameStyle {
            display: block;
            float: left;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .messagetime {
            // display: block;
            // float: left;
            padding-left: 1.5rem;
            // padding-top: 0.2rem;
            font-size: 0.5rem;
            color: #aaa;
        }

        .messageEnd {
            padding-top: 0.3rem;
            clear: both;
            font-size: 0.9rem;
            color: #999;

            span {
                font-size: 0.8rem;
            }

            b {
                font-size:0.8rem
            }
        }

        



    }

    .mainConter {
        margin: 2rem 1.2rem 0;
        // margin-top: 2rem;
        // margin-left: 1.2rem;
        font-size: 1rem;
    }

    .hrStyle {
        width: 90%;
        background-color: #fff;
        opacity: 0.5;
    }

.title {
    height: 7vh;
}


/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>