<template>
  <div class="Choicecontacts">
    <div class="head">
      <van-nav-bar
        fixed
        title="选择联系人"
        left-text="返回"
        @click-left="backon"
        left-arrow
        class="choice"
      >
      </van-nav-bar>
    </div>

    <van-search
      v-model="sms"
      @click="queryClick"
      @search="queryClick"
      @blur="queryClick"
      placeholder="请输入搜索关键词"
    />

    <div class="body">
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, key) in everyoneArr"
          :key="key"
          :title="key"
          :name="key"
        >
          <van-button type="default" v-model="checkAll" @click="chunk(item)"
            >全选</van-button
          >
          <van-button type="default" @click="check(item)">取消</van-button>
          <van-checkbox-group v-model="result">
            <van-cell-group>
              <van-cell
                v-for="once in item"
                clickable
                :key="once['user_id']"
                :title="` ${once['username']}`"
              >
                <template #right-icon>
                  <van-checkbox :name="once" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-collapse-item>
      </van-collapse>
    </div>

   

    <div class="upload">
      <van-goods-action>
        <van-goods-action-icon icon="guide-o"
        class="secletedico"
          >已选 {{ result.length }} 人
        </van-goods-action-icon>
        <div class="selectedbtn">


          <van-goods-action-button
            v-if="result != ''"
            type="info"
            class="confirmbtn"
            text="确定"
            @click="onClickButton"
          />
          <van-goods-action-button
            v-else
            type="info"
            class="confirmbtn"
            text="确定"
            @click="onClickButton"
            disabled
          />

        </div>
      </van-goods-action>
    </div>
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
    };
  },

  mounted() {
    this.rander();
  },

  methods: {
    //渲染
    rander() {
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 10000,
      });
      this.$axios
        .get({
          url: "message/maillist",
        })
        .then((res) => {
          console.log(res);
          if (res) {
            this.handleData(res);
          }
          this.Toast.clear();
        });
    },

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
              console.log(dataArr[res.data[x].name]);
              if (dataArr[res.data[x].name] != undefined) {
                dataArr[res.data[x].name].push(res.data[x]);
              } else {
                dataArr[res.data[x].name] = [];
                dataArr[res.data[x].name].push(res.data[x]);
              }
            }
            this.everyoneArr = dataArr;
            this.sms = "";
            this.showQuery = false;
          } else {
            this.Toast(res.message);
            this.sms = "";
            this.showQuery = false;
            // console.log(res.message)
          }

          // console.log(res, this.everyoneArr)
        });
    },

    //取消
    check: function (item) {
      console.log(item);
      if (this.result <= 0) {
        return;
      }
      this.result = this.result.sort();
      item = item.sort();
      console.log(this.result, item)
      // if (this.result.length >= item.length) {
      for (let x = 0; x < this.result.length; x++) {
        for (let i = 0; i < item.length; i++) {
          if (x >= 0 && this.result[x] == undefined) {
            console.log(111)
            return;
          }
          console.log( this.result[x] == undefined);

          if (this.result[x]["user_id"] == item[i]["user_id"]) {
            this.result.splice(x, 1);
          }
        }
      }
      // console.log(this.result)
    },
    //全选
    chunk: function (item) {
      this.result.push(...item);
      this.result = [...new Set(this.result)];
    },

    //确定选择
    onClickButton() {
      if (this.result.length <= 0) {
        this.Toast("至少选择一人");
        return;
      }
      this.$router.push({
        path: "/message/messagesend",
        query: {
          data: JSON.stringify(this.result),
        },
      });
    },

    //返回
    backon() {
      this.$router.push("/message/messagesend");
    },

    //处理数据
    handleData({ dataArr, listArr }) {
      console.log(dataArr, listArr);
      let allData = {};
      for (let x = 0; x < listArr.length; x++) {
        allData[listArr[x]["name"]] = [];

        for (let i = 0; i < dataArr.length; i++) {
          if (listArr[x]["department_id"] == dataArr[i]["department_id"]) {
            allData[listArr[x]["name"]].push(dataArr[i]);
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

.choice {
    height: 7vh;
}

.Choicecontacts {
  width: 100%;
  padding-top: 7vh;
  

  .body {
    padding-bottom: 5rem;
  }

  .chunk {
    padding: 0.7rem 2rem;
  }

  .upload {
   padding: 1rem 1rem 5vh 1rem;
    margin: 0 auto;
  }
}


.selectedbtn {
    padding-left: 1rem;
    widows: 80%;
  
}

.secletedico {
    padding-left: 1rem;
}

/deep/ .van-goods-action {
    height: 10vh;
    width: 100%;
}

/deep/ .confirmbtn {
        width: 70vw;
        font-size: 1rem;
} 

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>