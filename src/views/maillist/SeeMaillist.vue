<template>
    <div class="seemaillist">

        <div class="head">
            <van-nav-bar :title= userData.username left-text="返回" @click-left="backon"  left-arrow >
            </van-nav-bar>
        </div>

        <div class="main">
            <div class="images">
                <p class="headImg">
                    <img v-if="userData['user_head_url'] != null" :src="`${userData['user_head_url']}`" alt="">
                    <img v-else src="../../assets/img/员工.png" alt="">
                </p>
                <h3>
                    {{ userData.username }}
                </h3>
            </div>

            <div class="detailed">

                <div>
                    <b :style="{ fontSize: '0.8rem' } ">电话号码：</b><br>
                    <p class="tel">
                        {{ userData.phone }}
                    </p>

                    <p class="sex">
                        <img v-if="userData.sex == 1" src="../../assets/img/性别男.png" alt="">
                        <img v-else-if="userData.sex == 2" src="../../assets/img/性别女.png" alt="">
                    </p>
                    

                </div>

                <div class="email">
                    <b :style="{ fontSize: '0.8rem' } ">邮箱：</b><br>
                    <p >
                        <span v-if="userData.email != null" class="tel"> {{ userData.email }} </span>
                        <span v-else-if="userData.email == null" class="tel"> 这是我的邮箱 </span>
                    </p>

                </div>

                <div class="email">
                    <b :style="{ fontSize: '0.8rem' } ">入职时间： </b><br>
                    <p >
                        <span class="tel"> {{ userData['induction_time'] }} </span>
                    </p>

                </div>


                <div class="email other">
                    <van-collapse v-model="activeName" accordion class="otherData"> 
                        <van-collapse-item  title="其他资料" name="1">
                            <p>
                                昵称：
                                <span v-if="userData.signature != null" > {{ userData.nickname }} </span>
                                <span v-else-if="userData.signature == null" class="empty"> Null </span>
                            </p>
                            <p>
                                个性签名：
                                <span v-if="userData.signature != null" > {{ userData.signature }} </span>
                                <span v-else-if="userData.signature == null" class="empty"> Null </span>
                            </p>
                        </van-collapse-item>
                    </van-collapse>
                </div>

            </div>

        </div>

    </div>
</template>


<script>
export default {
    name: 'SeeMaillist',
    data () {
        return {
            userData: {},
            activeName: ['1'],
        }
    },

    mounted () {
        this.rander(this.$route.query.msgId)
    },
    methods: {

        rander (msgId) {
            this.Toast.loading({
                message: "",
                forbidClick: true,
                duration: 10000
            });
            this.$axios.post({
                url: 'message/seemessage',
                data: {
                    msgId
                }
            }).then(
                res => {
                    console.log(res)
                    this.Toast.clear();
                    res.rest[0]['induction_time'] = this.timestampToTime(res.rest[0]['induction_time'])
                    res.rest[0]['user_head_url'] = require('../../config').baseURL + '/imgs/temporary/' + res.rest[0]['user_head_url']
                    this.userData = res.rest[0]
                    console.log(this.userData)
                }
            )
        },

        timestampToTime (time) {
            let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '年'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月'
            let D = (date.getDate()+1 < 10 ? '0'+ date.getDate() : date.getDate()) + '日'
            return Y+M+D
            // console.log(timestampToTime (1533293827000))
        },

        backon () {
            this.$router.push('/maillist')
        }
    }
}
</script>


<style lang="less">


img {
    width: 100%;   
}

.empty {
    color: #ccc;
}

.seemaillist {
    .main {
        margin-top: 4rem;

    }
}

.main {
    .images {
        margin-left: 2rem;
        width: 24%;
        text-align: center;
        h3 {
            margin-top: 1rem;
        }
    }

    .headImg {
        width: 88px;
        height: 88px;
        border: 1px solid #aaa;
        border-radius: 50px;
        overflow: hidden;
        
    }

    .detailed {
        margin-top: 2rem;
        padding-left: 2rem;

        b {
            display: block;
            clear: both;
        }

        .tel {
            float: left;
            width: 60%;
            color: #888;
            font-size: 1.2rem;
        }

        .sex {
            float: right;
            margin-right: 2rem;
            width: 2rem;
            overflow: hidden;
        }

        .email {
            margin-top: 4rem;
        }
    }

    .other {
        width: 85%;
    }
}
/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>