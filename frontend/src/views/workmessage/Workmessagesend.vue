<template>
    <div class="noticesend">
        <div class="head">
            <van-nav-bar title="发送工作通知"
                        left-text="返回"
                        left-arrow
                        @click-left="$router.replace('/')">
            </van-nav-bar>
        </div>

        <div class="noticeMain">

            <div class="mainTitle"  @click="choicecontacts">
                <p>
                    <span class="left">请选择您要发送的人</span>
                    <span class="right">&gt;</span>
                </p>
                <p class="select">
                    <van-cell-group>
                        <van-field label="已选择：" v-model="select" readonly />
                    </van-cell-group>
                </p>
            </div>

            <div>
                <div class="texts">
                    <textarea name="texta" class="texta" cols="30" rows="10" placeholder="编辑工作通知的内容" v-model="textareas"></textarea>
                    <p class="btn">
                        <van-button type="info" @click="confirms" class="confirm">确认发送</van-button>
                        <van-button type="default" @click="cancel" class="cancel">取消发送</van-button>
                    </p>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: 'Workmessagesend',
    data () {
        return {
            textareas: '',  //公告内容
            selectData: [],    //已选联系人
            select: '',         //回显已选联系人
        }
    },
    mounted () {
        if (this.$route.query.data == undefined) return;
        this.selectrander (this.$route.query.data)
    },
    methods: {

        //取消发布
        cancel () {
            this.Dialog.confirm({
                title: '确定取消？',
                message: '取消发布将失去全部已编辑内容',
            })
            .then(() => {
                this.$router.push('/')
            })
        },

        //确定发布
        confirms () {
            this.Dialog.confirm({
                title: '确定发布？',
            })
            .then(() => {
                
                
                if (this.textareas.trim() == '') {
                    this.Toast.fail('内容不能为空');
                    return;
                }

                if (this.textareas.length > 500) {
                    this.Toast.fail('字符长度超出500');
                    return;
                }

                if (this.selectData.length > 100) {
                    this.Toast.fail('至少选择1人');
                    return;
                }


                this.$axios.post({
                     url: 'workmessage/sendmsg',
                    data: {
                        content: this.textareas,
                        userArr: this.selectData
                    }
                }).then (
                    res => {
                        if (res.code == 0) {
                            this.Toast.success('成功发布');
                            this.$router.replace('/about')
                        } else {    
                            this.Toast.fail(res.message);
                        }
                    }

                )

            })
        },

        //联系人列表
        choicecontacts () {
            this.$router.push('/workmessage/workmessagesend/workmsgceco')
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

<style lang="less" scoped>

.noticesend {

    .noticeMain {
        width: 100%;
        height: auto;
        .mainTitle {
            margin: 2rem auto;
            width: 80%;
            height: auto;
            border-radius: 0.5rem;
            overflow: hidden;
        }

        .left {
            display: block;
            float: left;
            margin-left: 1rem;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .right {
            display: block;
            float: right;
            margin-right: 1rem;
            color: #999;
        }

        .select {
            clear: both;
            padding: 0.5rem;
            .selectName {
                display: block;
                
                width: 80%;
                border: 1px solid red;
            }
        }
    }

    .texts {

        width: 80%;
        margin: 2rem auto;
        clear: both;
        .texta {
            width: 100%;
            height: auto;
            resize: none;
        }   

        textarea {
            padding: 0.5rem;
            border-radius: 1rem;
        }
    }
}

</style>