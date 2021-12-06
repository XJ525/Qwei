<template>
    <div class="noticesend">
        <div class="head">
            <van-nav-bar title="发布新公告"
                        left-text="返回"
                        left-arrow
                        @click-left="$router.replace('/')">
            </van-nav-bar>
        </div>

        <div class="noticeMain">

            <div class="mainTitle">
                <!-- <van-cell-group>
                    <van-field v-model="value" label="公告标题" placeholder="请输入公告标题" />
                </van-cell-group> -->
                <van-field
                    v-model="value"
                    rows="2"
                    autosize
                    label="公告标题"
                    type="textarea"
                    maxlength="50"
                    placeholder="请输入公告的标题"
                    show-word-limit
                    />
            </div>

            <div>
                <div class="texts">
                    <textarea name="texta" class="texta" cols="30" rows="10" placeholder="编辑公告内容" v-model="textareas"></textarea>
                    <p class="btn">
                        <van-button type="info" @click="confirms" class="confirm">确认发布</van-button>
                        <van-button type="default" @click="cancel" class="cancel">取消发布</van-button>
                    </p>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: 'Noticesned',
    data () {
        return {
            value: '',      //公告标题
            textareas: '',  //公告内容
        }
    },
    mounted () {

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
                
                if (this.value.trim() == '') {
                    this.Toast.fail('标题不能为空');
                    return;
                }

                if (this.textareas.trim() == '') {
                    this.Toast.fail('内容不能为空');
                    return;
                }

                if (this.textareas.length > 100) {
                    this.Toast.fail('内容字符过长');
                    return;
                }


                this.$axios.post({
                    url: 'notice/notice',
                    data: {
                        title: this.value,
                        content: this.textareas,
                    }
                }).then (
                    res => {
                        if (res.code == 0) {
                            this.Toast.success('成功发布');
                            this.$router.push('/')
                        } else {    
                            console.log(res.message)
                            this.Toast.fail(res.message);
                        }
                    }

                )

            })
        },

    }
}
</script>

<style lang="less" scoped>

.noticesend {
    min-height: 100vh;

    .noticeMain {
        width: 100%;
        height: auto;
        .mainTitle {
            margin: 1rem auto 0.5rem auto;
            width: 90%;
            height: auto;
            border-radius: 0.5rem;
            overflow: hidden;
        }
    }

    .texts {

        width: 90%;
        margin: 0.3rem auto;
        clear: both;
        .texta {
            padding-top: 0.5rem;
            padding-left: 5%;
            width: 95%;
            height: auto;
            border: none;
        }   
    }
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}


</style>