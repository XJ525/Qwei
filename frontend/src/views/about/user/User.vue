<template>
  <div class="Choicecontacts">
    <div class="head">
      <van-nav-bar
        fixed
        title="用户"
        left-text="返回"
          right-text="添加"
        @click-left="backon"
        @click-right="onClickRight"
        left-arrow
        class="usertitle"
      >
        <!-- <template #right>
          <van-icon name="search" size="18" @click="querys" />
        </template> -->
      </van-nav-bar>
    </div>

    <van-search
      v-model="sms"
      @click="queryClick"
      @search="queryClick"
      @cancel="onCancel"
      @blur="queryClick"
      placeholder="请输入搜索关键词"
      class="sear"
    />
   

    <div class="body">
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, key) in everyoneArr"
          :key="key"
          :title="key"
          :name="key"
          :ref="key"
        >
           <van-checkbox-group v-if="item == ''" v-model="result">
               <span style="font-size:0.5rem">该部门还没有员工哦</span>
            </van-checkbox-group> 
          <van-checkbox-group v-model="result">
            <van-cell-group>
              <van-swipe-cell v-for="(once, keys) in item" :key="keys">
               
                
                <van-cell
                  clickable
                  :title="` ${once['username']}`"
                  @click="seeMsg(once['user_id'])"
                >
                </van-cell>
               
                <template #right>
                
                  <van-button  
                    v-if="everyoneArr[key][keys].open_status == '-1'"
                    square
                    text="解冻"
                    type="danger"
                    class="delete-button"
                    @click="freezes(once['user_id'], '1', key, keys)"
                  />
                  <!-- everyoneArr[key][keys].open_status -->
                  <van-button
                    v-else
                    square
                    text="冻结"
                    type="danger"
                    class="delete-button"
                    @click="freezes(once['user_id'], '-1', key,keys)"
                  />

                  <van-button
                    square
                    text="重置密码"
                    @click="replece(once['user_id'])"
                    type="danger"
                    class="redice"
                  />
                </template>
              </van-swipe-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-collapse-item>
      </van-collapse>
    </div>

    <van-popup v-model="showQuery" position="top" :style="{ height: '7%' }">
      <!-- <div class="querysClick">
        <van-field
          v-model="sms"
          center
          clearable
          placeholder="请输入用户名或部门"
          :style="{ height: '100%' }"
        >
          <template #button>
            <van-button plain type="info" class="btn" @click="queryClick"
              >确认搜索</van-button
            >
          </template>
        </van-field>
      </div> -->
    </van-popup>
  </div>
</template>


<script>
export default {
  name: "Choicecontacts",
  data() {
    return {
      everyoneArr: [],
      checkedVal: [],
      activeNames: [],
      result: [],
      showQuery: false,
      checkAll: false,
      sms: "",
      nowLoginId: "",
      value: "",
      state: true,
      frezz: "冻结",
      blog: false,
    };
  },

  mounted() {
    //渲染
    this.Toast.loading({
      message: "",
      forbidClick: true,
      duration: 0,
    });
    this.$axios
      .get({
        url: "message/maillist",
      })
      .then((res) => {
        // console.log(res);
        if (res) {
          this.handleData(res);
        }
        this.Toast.clear();
      });

    // this.$axios
    //   .get({
    //     url: "/message/maillistate",
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });
  },

  methods: {
    //搜索栏
    querys() {
      this.showQuery = true;
    },

    //模糊搜索
    queryClick() {
      let sms = this.sms.trim();
      if (sms == "") {
        return "搜索信息不能为空";
      }

      this.$axios
        .post({
          url: "message/querylist",
          data: {
            msg: sms,
          },
        })
        .then((res) => {
          if (res.code == 0) {
            let dataArr = {};
            for (let x = 0; x < res.data.length; x++) {
              //   console.log(dataArr[res.data[x].name]);
              if (dataArr[res.data[x].name] != undefined) {
                dataArr[res.data[x].name].push(res.data[x]);
              } else {
                dataArr[res.data[x].name] = [];
                dataArr[res.data[x].name].push(res.data[x]);
              }
            }

            this.everyoneArr = dataArr;
            console.log(this.$refs[dataArr[0]]);
            this.sms = "";
            this.showQuery = false;
            this.state = true;
          } else {
            this.Toast(res.message);
            this.sms = "";
            this.showQuery = false;
            // console.log(res.message)
          }

          // console.log(res, this.everyoneArr)
        });
    },

    //添加用户
    onClickRight() {
      this.$router.push({
        path: "/about/us/test"
      })
    },

    //冻结账号
    freezes(uid, sta, name, key) {
      this.$axios
        .post({
          url: "user/freeze",
          data: {
            uid: JSON.stringify([uid]),
            option: sta,
          },
        })
        .then((res) => {

          if (res && res.code) {
            
            if (res.code == "0") {
              
              this.Toast.success("成功");
            
              if (sta == '1') {
                
                  this.everyoneArr[name][key].open_status = '1';
              } else {
               
                  this.everyoneArr[name][key].open_status = '-1';
              }
              console.log(this.everyoneArr[name][key].open_status)
            
            } else {
              this.Toast.fail("失败");
            }

          }

          console.log(res);
        });
    },
    //重置密码
    replece(uid) {
      console.log(uid);
      this.Dialog.confirm({
        title: "重置密码",
        message: "是否确认重置密码？",
      })
        .then(() => {
          // on confirm
          this.$axios
            .post({
              url: "/user/repwd",
              data: {
                uid,
              },
            })
            .then((res) => {
              if (res && res.code == "0") {
                this.Toast.success("重置密码成功");
              } else {
                this.Toast.fail("重置密码失败");
              }
            });
        })
        .catch(() => {
          // on cancel
          this.Toast({
            message: "已取消",
            position: "bottom",
          });
        });
    },

    seeMsg(msgId) {
        this.$router.push(`/about/user/alter/${msgId}`);
        console.log(msgId);
    },

    onSearch(msgId) {
      //   this.$router.push(`/about/user/alter/${msgId}`);
    },

    onCancel() {
      this.Toast("取消");
    },

    //返回
    backon() {
      this.$router.push("/about");
    },

    //处理数据
    handleData({ dataArr, listArr }) {
      // console.log(dataArr, listArr)
      let allData = {};
      if (listArr && listArr.length) {
        for (let x = 0; x < listArr.length; x++) {
          allData[listArr[x]["name"]] = [];

          for (let i = 0; i < dataArr.length; i++) {
            if (listArr[x]["department_id"] == dataArr[i]["department_id"]) {
              allData[listArr[x]["name"]].push(dataArr[i]);
            }
          }
        }
      }

      this.everyoneArr = allData;
      // console.log(allData)
    },
  },
};
</script>



<style scoped lang="less">
.Choicecontacts {
  padding-top: 14vh;
  min-height: 86vh;
}

.sear {
  width: 100vw;
  height: 7vh;
  position: fixed;
  left: 0;
  top: 7vh;
  z-index: 99;
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

.Choicecontacts {
  width: 100%;

  .body {
    padding-bottom: 5rem;
  }

  .chunk {
    padding: 0.7rem 2rem;
  }

  .upload {
    width: 80%;
  }
}

.delete-button {
  height: 100%;
  border: none;
  background-color: #ffd35c;
}

.redice {
  background-color: #1989fa;
  border: none;
  height: 100%;
}

.usertitle {
  height: 7vh;
}


/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>