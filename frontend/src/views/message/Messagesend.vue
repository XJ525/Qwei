<template>
    <div class="messagesend">
        <div class="head">
            <van-nav-bar title="发布站内信" left-text="返回" @click-left="backon" left-arrow>
            </van-nav-bar>
        </div>

        <div class="mains">

            <div class="contacts" @click="choicecontacts">
                    <span class="left">请选择您要发送的人</span> 
                    <span class="right"><van-icon name="arrow" /></span> 
            </div>

            <div class="texts">
                <van-field
                v-model="textareas"
                class="texta"
                name="texta"
                rows="10"
                type="textarea"
                maxlength="500"
                placeholder="编辑内容"
                show-word-limit
                />
              

                <p class="btn">
                    <!-- select -->
                   
                    <van-button type="info" v-if="select != '' && textareas != ''" @click="confirms" class="confirm">确认发布</van-button>
                     <van-button type="info" v-else  class="confirm" disabled>确认发布</van-button>
                    <van-button type="default" @click="cancel" class="cancel">取消发布</van-button>
                </p>
            </div>


            
            
        </div>

        <div class="selected">
                已选择：
                <span :v-model="select" class="selectedperson">
                    {{ select }}
                </span>
        </div>

    </div>
</template>


<script>
export default {
    name: 'Messagesend',
    data () {
        return {
            textareas: '',
            select: '',
            selectData: [],
        }
    },

    mounted() {
        if (this.$route.query.data == undefined) return;
        this.selectrander (this.$route.query.data)
    },

    methods: {
        //返回
        backon () {
            this.$router.push('/message')
        },

        //选择联系人
        choicecontacts () {
            this.$router.push('/message/messagesend/choicecontacts')
        },

        //取消发布
        cancel () {
            this.Dialog.confirm({
                title: '确定取消？',
                message: '取消发送将失去全部已编辑内容',
            })
            .then(() => {
                this.$router.push('/message')
            })
        },

        //确定发布
        confirms () {
            this.Dialog.confirm({
                title: '确定发布？',
            })
            .then(() => {
                this.textareas = this.textareas.trim();
                if (this.textareas == '') {
                    this.Toast.fail('内容不能为空');
                    return;
                }

                this.$axios.post({
                    url: 'message/sendmsg',
                    data: {
                        content: this.textareas,
                        userArr: this.selectData
                    }
                }).then (
                    res => {
                        if (res.code == 0) {
                            this.Toast.success('发布成功');
                            this.$router.push('/message')
                        } else {    
                            console.log(res.message)
                            this.Toast.fail(res.message);
                        }
                    }
                )

            })
        },

        //已选择的人数
        selectrander (dataArr) {
            dataArr = JSON.parse(dataArr)
            for (let x = 0; x < dataArr.length; x++) {
                this.select += (this.select == '') ? dataArr[x].username : ', ' + dataArr[x].username;
                this.selectData.push(dataArr[x]['user_id'])
            }
        },
    }
}
</script>


<style lang="less">
.messagesend {
    height: 100vh;
}

.mains {

    width: 100%;
    height: auto;


    .contacts {
            margin: 3rem auto 1rem auto;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background-color: #fff;
            width: 80%;
            height: 2rem;
            line-height: 2rem;
            .left {
                display: block;
                float: left;
                color: #adb5bd;
                margin-left: 1rem;
                font-size: 0.8rem;
               
            }

            .right {
                display: block;
                float: right;
                margin-right: 1rem;
                color: #dee2e6;
            }
        
    }


    .texts {

        width: 80%;
        margin: 2rem auto;
        clear: both;
        .texta {
            width: 100%;
            height: auto;
            border: none;
            // resize: none;
        }   
    }


    .btn {
        margin-top: 1rem;
        .cancel {
            display: block;
            float: left;
            margin-left: 0.5rem;
            color: #343a40;
            background-color: #e9ecef;
        }

        .confirm {
            display: block;
            float: left;
        }

    }
    
    
}

.selected {
    margin-top: 5rem;
    margin-left: 3rem;
    width: 70%;
    height: auto;
}

.selectedperson {
    color: #343a40;
    font-size: 0.8rem;
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}

</style>