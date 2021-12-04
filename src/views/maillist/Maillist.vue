<template>

    <div class="maillist">
        <div class="head">
            <van-nav-bar title="联系人" left-text="返回" left-arrow>
                <template #right>
                    <van-icon name="search" size="18" @click="querys" />
                </template>
            </van-nav-bar>
        </div>

        <div class="main" v-if="everyoneArr">
            <!-- <van-index-bar :index-list="indexList"> -->

                <van-index-anchor v-for="(item, index) in everyoneArr" :key="index" index="1">
                    {{ index }}
                    <van-cell  v-for="(once, key) in item" :key="key" :title = once.username @click="seeMsg(once['user_id'])" >
                        <div class="everyOneMsg">
                            <p class="userName">
                                &gt;
                            </p>

                        </div>
                        
                    
                    </van-cell>
                </van-index-anchor>
            <!-- </van-index-bar> -->
                
        </div>

        <div class="load" v-else>
            <van-loading size="24px">加载中...</van-loading>
        </div>

        <van-popup v-model="showQuery" position="top" :style="{ height: '7%' }">

            <div class="querysClick">
                <van-field
                v-model="sms"
                center
                clearable
                placeholder="请输入用户名或部门"
                :style="{ height: '100%' }"
                >
                <template #button>
                    <van-button plain type="info" class="btn" @click="queryClick">确认搜索</van-button>
                </template>
                </van-field>
            </div>

        </van-popup>

    </div>
</template>

<script>
export default {
    name: 'Maillist',
    data() {
        return {
            indexList: [],
            everyoneArr: {},
            sms: '',
            showQuery: false,
        }
    },

    mounted () {
        this.rander()
    },

    methods: {
        //渲染
        rander() {
            this.Toast.loading({
                message: "",
                forbidClick: true,
                duration: 10000
            });
            this.$axios.get({
                url: 'message/maillist'
            }).then(
                res => {
                    if (res && res.code == 0) {

                        this.handleData(res)

                    }

                    
                    this.Toast.clear();

                }
            )
        },

        //搜索栏
        querys() {
            this.showQuery = true;
        },

        //模糊搜索
        queryClick () {
            let sms = this.sms.trim();
            if (sms == '') {
                return '搜索信息不能为空'
            }

            this.$axios.post({
                url: 'message/querylist',
                data: {
                    msg: sms
                }
            }).then(
                res => {
                    if (res.code == 0) {
                        let dataArr = {}
                        for (let x = 0; x < res.data.length; x++) {
                            if (dataArr[res.data[x].name] != undefined) {
                                dataArr[res.data[x].name].push(res.data[x])
                            } else {
                                dataArr[res.data[x].name] = [];
                                dataArr[res.data[x].name].push(res.data[x])
                            }
                        }
                        this.everyoneArr = dataArr
                        this.sms = '';
                        this.showQuery = false;
                    } else {
                        this.Toast(res.message);
                        this.sms = '';
                        this.showQuery = false;
                    }

                }
            )

        },

        //查看用户详细信息
        seeMsg(msgId) {

            this.$router.push(`/maillist/seemaillist?msgId=${msgId}`)
        },

        //处理数据
        handleData ({ dataArr, listArr }) {
            let allData = {};
            for (let x = 0; x < listArr.length; x++) {
                allData[listArr[x]['name']] = [];

                for (let i = 0; i < dataArr.length; i++) {
                    if (listArr[x]['department_id'] == dataArr[i]['department_id']) {
                        allData[listArr[x]['name']].push(dataArr[i])
                    }
                }
            }
            this.everyoneArr = allData;
        }

    }

}
</script>

<style lang="less" >

.maillist {
    background-color: #f8f9fa;

    
}

.load {
    margin: 5rem auto;
    width: 25%;

}

.querysClick {
    margin: 2% auto;
    width: 80%;
    height: 70%;
    border: 1px solid #999;
    border-radius: 1.5rem;
    overflow: hidden;
    .btn {
        border: none;
        border-left: 1px solid #999;
        span {
            color: #777;

        }
    }
}

.everyOneMsg {
    display: flex;
    .headImg {
        flex: 2;
        text-align: center;
    }

    p {
        display: block;
        margin-block-start: 0;
        margin-block-end: 0;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }

    .userName {
        flex: 8;
        font-size: 1.2rem;
        color: #dedede;
    }
}

</style>