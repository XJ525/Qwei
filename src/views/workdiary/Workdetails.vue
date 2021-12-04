<template>
    <div class="workdetails">
       
        <div class="head">
            <van-nav-bar title="日志详情" fixed class="datdefail" left-text="返回" @click-left="backOn" left-arrow>
            </van-nav-bar>
        </div>


            <div class="workdetailsConters">
            
                <div class="img">
                    <i>
                        <img :src="data['user_head_url']" alt="" :v-lazy="data['user_head_url']">
                    </i>
                </div>

                <div class="conter">
                    <div class="conterLeft">
                        <p>
                            <span class="usernameStyle">员工： {{ data.username }} </span>  
                        </p>
                        <p class="messageEnd">
                            <span class="messagetime">提交时间 {{ data.log_time }} </span>
                        </p>
                    
                    </div>
                </div>
            </div>

           

            <div class="mainConter">

               
                <van-field v-model="statu" type="text" label="日志状况"  :style="{ fontSize:'1rem',padding:'0.3rem'}" readonly />

                <van-field v-model="text" type="textarea" label="日志内容" :style="{ fontSize:'1rem',padding:'0.3rem'}"  readonly  autosize rows="1" />
            </div> 


    </div>

</template>


<script>
export default {
    name: 'Workdetails',
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
       
         //当事人信息
        // this.data = JSON.parse(this.$route.query.data);
        this.data = JSON.parse(localStorage.getItem('data'));
        localStorage.removeItem('data');
        console.log(this.data)  
       
        this.text = this.data.log_content;
        
        if (this.data.log_read_state == 0) {
            this.statu = '未批阅';
        } else {
            this.statu = '已阅读';
        }

        this.$axios.post({
            url:"/worklog/readworklog",
            data:{
                logid:this.data.log_id
            }
        }).then(
            res => {
                console.log(res)
            }
        )
        

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
            this.$router.push('/workapproval')
        },

    }

}
</script>

<style scoped lang="less">

.workdetails {
    padding-top: 7vh;
    width: 100%;
    min-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #f8f9fa;

    .messageNull {
        margin: 3rem auto;
        width: 80%;
        text-align: center;
        color: #787887;
    }

    .datdefail {
        height: 7vh;
    }
}


.workdetailsConters {
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
            padding-top: 1rem;
            padding-left:1.5rem;
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
            padding-top: 0.5rem;
            clear: both;
            font-size: 0.9rem;
            color: #999;
        }

    }

    .mainConter {
        margin: 2rem 1.2rem 0;
        // margin-top: 2rem;
        // margin-left: 1.2rem;
        font-size: 1rem;
    }



    .btn{
        margin:8vh 0;
        border-radius: 4vh;
        background-color: #7ab4ee;
        border:none;
    }

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}

</style>