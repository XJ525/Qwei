<template>
    <div class="detInfo">
       
        <div class="head">
            <van-nav-bar title="请假详情" fixed class="leavedfail" left-text="返回" @click-left="backOn" left-arrow>
            </van-nav-bar>
        </div>


            <div class="messageConters">
            
                <div class="img">
                    <i>
                        <img :src="data['user_head_url']" alt="" :v-lazy="data['user_head_url']">
                    </i>
                </div>

                <div class="conter">
                    <div class="conterLeft">
                        <p>
                            <span class="usernameStyle"> {{ data.username }} </span>  
                        </p>
                        <p class="messageEnd">
                            <span class="messagetime"> {{ data.apply_time }} </span>
                        </p>
                    
                    </div>
                </div>
            </div>

          

            <div class="mainConter">

                <van-field v-model="type" label="请假类型" :style="{ fontSize:'1rem'}" readonly />
               
                <van-field v-model="starttime" type="text" label="开始时间" :style="{fontSize:'1rem'}"  readonly />
              
                <van-field v-model="endtime" type="text" label="结束时间" :style="{ fontSize:'1rem'}"  readonly />
               
                <van-field v-model="statu" type="text" label="审核状况"  :style="{ fontSize:'1rem'}" readonly />

                <van-field v-model="text" type="textarea" label="请假事由" :style="{ fontSize:'1rem'}"  readonly  autosize rows="1" />
            </div> 

     

            <div v-if="statu == '未审核' ">
                <van-button type="info" block class="btn" @click="opinion( data.leave_id ,1)">同意</van-button>
                
                <van-button type="info" block class="btn" @click="opinion( data.leave_id ,2)">拒绝</van-button>
            </div>
    </div>

</template>


<script>
export default {
    name: 'Detailsapproval',
    data () {
        return {
            data:'',
            type:'',
            starttime:'',
            endtime:'',
            text:'',
            statu:'',
        }
    },

    mounted () {
        // this.getMessageDet(this.$route.query.data);
        

         //当事人信息
        // this.data = JSON.parse(this.$route.query.data);
        this.data = JSON.parse(localStorage.getItem('data'));
        localStorage.removeItem('data');
        console.log(this.data)  
       
        //开始时间
        this.data.start_time = this.timestampToTime(this.data.start_time); 
        //结束时间
        this.data.end_time = this.timestampToTime(this.data.end_time);

        this.type = this.data.apply_type;
        this.starttime = this.data.start_time;
        this.endtime = this.data.end_time;
        this.text = this.data.leave_reason;
        
        if (this.data.audit_state == 0) {
            this.statu = '未审核';
        } else if (this.data.audit_state == 1) {
            this.statu = '通过';
        } else if (this.data.audit_state == 2) {
            this.statu = '未通过';
        }
        

    },

    methods: {

        timestampToTime (time) {
            let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
            let D = (date.getDate()+1 < 10 ? '0'+ date.getDate() : date.getDate()) + ' '
           
            return Y+M+D
            // console.log(timestampToTime (1533293827000))
        },

        backOn() {
            this.$router.push('/allapproval')
        },

        opinion(name, val) {
            // console.log(name,val)

            this.$axios.post({
                url:'/leave/agreeleave',
                data:{
                    leaveid:name,
                    state:val
                }
            }).then(
                res => {
                    if (res && res.code == 0) {
                        this.$toast("审核完毕")
                        this.$router.push({
                            path:'/allapproval'
                        })
                    } else {
                        this.$toast("审核完毕")
                        this.$router.push({
                            path:'/allapproval'
                        })
                    }
                }
            )
        }
    }

}
</script>

<style scoped lang="less">

.leavedfail {
    height: 7vh;
}

.detInfo {
    width: 100%;
    padding-top: 7vh;
    min-height: 100vh;
    background-color: #f8f9fa;

    .messageNull {
        margin: 3rem auto;
        width: 80%;
        text-align: center;
        color: #787887;
    }
}


.messageConters {
        width: 90%;
        height: auto;
        display: flex;
        align-content: stretch;
        background-color: #fff;
        border-radius: 5px;
        margin:1vh auto;

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
                border:none;
                margin:calc((100% - 1rem) / 2) auto;
                img {
                    width:3rem;
                    height:3rem;
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
            padding-left:1.5rem;
            padding-top: 1rem;
            float: left;
            font-size: 1.1rem;
            font-weight: bold;
        }

        .messagetime {
            display: block;
            float: left;
            padding-left: 1.5rem;
            padding-top: 0.2rem;
            font-size: 0.8rem;
            color: #aaa;
        }

        .messageEnd {
            padding-top: 0.3rem;
            clear: both;
            font-size: 0.9rem;
            color: #999;
        }

    }

    .mainConter {
        width: 90%;
        margin: 0.2rem auto;
        // margin-top: 2rem;
        // margin-left: 1.2rem;
        font-size: 1rem;
    }

    .hrStyle {
        width: 99%;
        background-color: #fff;
        opacity: 0.5;
    }

    .btn{
        width: 90%;
        margin:2vh auto;
        border-radius: 4vh;
        font-size: 1rem;
        background-color: #1989fa;
        border:none;
    }
/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>