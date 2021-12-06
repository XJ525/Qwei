<template>
  <div class="seemaillist">
    <div class="head">
      <van-nav-bar
        :title="userData.username"
        left-text="返回"
        @click-left="backon"
        left-arrow
        class="nav"
      >
      </van-nav-bar>
    </div>

    <van-cell-group>
      <van-field
        v-model="userData.username"
        label="姓名"
        placeholder="请输入用户名"
        readonly
      />
      <van-field v-model="userData.phone" type="tel" label="手机号" readonly />
    </van-cell-group>

    <van-field v-model="sex" label="性别" readonly />
    <!-- 角色 -->
    <van-field
      readonly
      clickable
      name="picker"
      :value="value"
      label="选择角色"
      v-model="role_name"
      placeholder="点击选择角色"
      @click="showPicker = true"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <!-- 部门 -->
    <!-- 选择部门 -->
      <van-field
        readonly
        clickable
        name="picker"
        :value="values"
        v-model="depart_name"
        label="选择部门"
        placeholder="点击选择部门"
        @click="showPickers = true"
      />
      <van-popup v-model="showPickers" position="bottom">
        <van-picker
          show-toolbar
          :columns="list"
          @confirm="onConfirms"
          @cancels="showPickers = false"
        />
      </van-popup>


    <van-cell-group>
      <van-field
        v-model="userData.email"
        label="邮箱"
        placeholder="该用户未填写邮箱"
        readonly
      />
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="times" label="入职时间" readonly />
    </van-cell-group>

    <div class="email other">
      <van-collapse v-model="activeName" accordion class="otherData">
        <van-collapse-item title="其他资料" name="1">
          <p>
            昵称：
            <span v-if="userData.signature != null">
              {{ userData.nickname }}
            </span>
            <span v-else-if="userData.signature == null" class="empty">
              
            </span>
          </p>
          <p>
            个性签名：
            <span v-if="userData.signature != null">
              {{ userData.signature }}
            </span>
            <span v-else-if="userData.signature == null" class="empty">
              
            </span>
          </p>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>


<script>
export default {
  name: "SeeMaillist",
  data() {
    return {
      userData: {},
      activeName: ["1"],
      showPicker: false,
      columns: [],
      list: [],
      value: "",
      columns_role_id: {},
      sex: "",
      role_name: "",
      times: "",
      showPickers: false,
      values: "",
      depart_id:"",
      depart_name:"",
    };
  },

  mounted() {
    this.rander(this.$route.params.id);
  },
  methods: {
    onConfirm(value) {
      this.Toast.loading({
        message: '修改中...',
        forbidClick: true,
        duration: 0
      });
      this.role_name = value;
      this.showPicker = false;
     
      let rid = "";
      for (let x in this.columns_role_id) {
        if (this.columns_role_id[x] == value) {
          rid = x;
        }
      }
      this.$axios
        .post({
          url: "/message/alteruserrole",
          data: {
            msgId: this.$route.params.id,
            roleId: rid,
          },
        })
        .then((res) => {
          //判断是否修改成功
          if (res && res.code == "0") {
            this.Toast.success("修改角色成功");
            setTimeout(() => {
              this.$router.push({
              path: "/about/user",
            });     
            }, 1000);
          } else {
            this.Toast({
              message: "修改失败",
              position: "bottom",
            });
          }
          
        });

        this.Toast.clear();

    },


    onConfirms(value) {
      this.Toast.loading({
        message: '修改中...',
        forbidClick: true,
        duration: 0
      });
      this.values = value;
      this.showPickers = false;
      // console.log(value)
      for (let x in this.list_department_id) {
        if (this.list_department_id[x] == value) {
          // console.log(x)
          this.depart_name = value;
          this.depart_id = x;
        }
      }
      
      //修改用户部门
      this.$axios.post({
        url: '/message/alteruserpart',
        data: {
          msgId: this.$route.params.id,
          departId: this.depart_id
        }
      }).then(
        res => {
          if (res && res.code == "0" ) {
            this.Toast.success("修改部门成功")
          } else {
            this.Toast({
              message: "修改失败",
              position: "bottom",
            });
          }
         
        }
      )
      this.Toast.clear();


    },

    rander(msgId) {
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 0,
      });

      this.$axios
      .get({
        url: "/role/select_role", //所有角色
      })
      .then((res) => {
        // console.log(res)
        // this.select = res;

        if (res instanceof Array) {
          res.forEach((it) => {
            this.columns.push(it.role_name);
            this.columns_role_id[it.roleid] = it.role_name;
          });
        }
      });


      
      this.$axios
        .post({
          url: "/message/usersmssage",
          data: {
            msgId,
          },
        })
        .then((res) => {
          console.log("mesg", res);
          this.Toast.clear();
          
          if (res && res.rest[0]) {
            this.times = this.timestampToTime(res.rest[0]["induction_time"]);
            this.userData = res.rest[0];

            if (res.rest[0].sex == 1) {
              this.sex = "男";
            } else {
              this.sex = "女";
            }
            
            this.depart_name = res.rest[0].name;
            // this.depart_id = res.rest[0].department_id;
            this.role_name = res.rest[0].role_name;
          } 
        });

        //获取部门目录
        this.$axios
          .get({
            url: "/department/select",
          })
          .then((res) => {
            let department_obj = [];
            let department_objs = {};
            res.forEach((item) => {
              department_obj.push(item.name);
              department_objs[item.department_id] = item.name;
            });
            this.list = department_obj;
            this.list_department_id = department_objs;
            

            // console.log(this.list_department_id)
          });



    },

    timestampToTime(time) {
      let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "年";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月";
      let D =
        (date.getDate() + 1 < 10 ? "0" + date.getDate() : date.getDate()) +
        "日";
      return Y + M + D;
      // console.log(timestampToTime (1533293827000))
    },

    backon() {
      this.$router.push("/about/user");
    },
  },
};
</script>


<style lang="less" scoped>
.nav {
  height: 7vh;
  color: #000;
}

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
  color: #000;
  font-size: 1rem;
}
</style>