<template>
  <div>
    <!-- 新建角色 -->
    <!-- <div class="btn" v-if="$route.params.id == 4">
      <van-nav-bar
        left-text="返回"
        left-arrow
        title="新建角色"
        class="head"
        @click-left="onClickLeft"
      />
      <van-cell-group title="角色名">
        <van-field
          v-model="value"
          class="new_role"
          label="角色名"
          placeholder="请输入角色名"
        />
      </van-cell-group>

      <van-checkbox-group class="" v-model="result">
        <van-cell-group title="选择权限">
          <van-cell
            v-for="(item, index) in option"
            clickable
            class="new_roles"
            :key="item.pid"
            :title="` ${item.pname}`"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox :name="item.pid" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>

      <van-button
        v-if="result.length != 0 && value != ''"
        @click="submits"
        type="info"
        class="sub"
        >提交</van-button
      >
      <van-button v-else type="info" class="sub" disabled>提交</van-button> -->
      <!-- <p>已选择{{ result }}</p> -->
    <!-- </div> -->

    <!-- 查询权限 -->
    <!-- <div class="selet_role_info" v-else-if="$route.params.id == 6">
      <van-nav-bar
        left-text="返回"
        left-arrow
        title="查询权限"
        class="head"
        @click-left="onClickLeft"
      />
      <van-field
        type="digit"
        label="权限ID"
        v-model="powerid"
        placeholder="请输入权限ID"
      />
      <van-button type="info" class="sub" @click="submits">查询</van-button>
      <van-popup class="pop_box" v-model="showcontent">
        查询结果:{{ showsub }}
      </van-popup>
    </div> -->

    <!-- 添加用户 -->
    <div class="btn" v-if="$route.params.id == 13">
      <van-nav-bar
        left-text="返回"
        left-arrow
        title="添加用户"
        class="head"
        @click-left="onClickLeft"
      />
      <van-field
        v-model="tel"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-cell-group>
        <van-field
          v-model="username"
          label="姓名"
          maxlength="20"
          placeholder="请输入真实姓名"
        />
      </van-cell-group>

      <van-field name="radio" label="性别">
        <template #input>
          <van-radio-group v-model="sexvalue" direction="horizontal">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- 角色 -->
      <van-field
        readonly
        clickable
        name="picker"
        :value="value"
        label="选择角色"
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
      <!-- 选择部门 -->
      <van-field
        readonly
        clickable
        name="picker"
        :value="values"
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
      <!-- 入职时间 -->
      <van-cell title="选择入职时间" 
      :value="date" 
      @click="showtime = true" />

      <van-calendar v-model="showtime" 
      :min-date="minDate"
      :max-date="maxDate"
       @confirm="onConfirmss" />

      <!-- 复选框 -->
      <!-- <van-checkbox-group v-model="result">
      <van-cell-group>
        <van-divider content-position="center" class="department">选择部门</van-divider>
        <van-cell
          v-for="(item, index) in list"
          clickable
          :key="item"
          :title="`${item}`"
          @click="toggle(index)"
        >
          <template #right-icon>
            <van-checkbox :name="item" ref="checkboxes" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group> -->
      <van-button
        type="info"
        v-if="
          value != '' &&
          values != '' &&
          username != '' &&
          tel != '' &&
          date != ''
        "
        class="btnsubmit"
        @click="submits"
        >提交</van-button
      >
      <van-button type="info" v-else class="btnsubmit" @click="submits" disabled
        >提交</van-button
      >
      <!-- <p>已选择{{ result }}</p> -->
    </div>

    <!-- 冻结用户 -->
    <div class="btn" v-else-if="$route.params.id == 14">
      <van-nav-bar
        left-text="返回"
        left-arrow
        title="冻结用户"
        class="head"
        @click-left="onClickLeft"
      />
      <van-field
        type="text"
        label="用户ID"
        v-model="powerid"
        placeholder="请输入用户ID"
      />
      <van-field name="radio" label="操作">
        <template #input>
          <van-radio-group v-model="sexvalue" direction="horizontal">
            <van-radio name="1">冻结</van-radio>
            <van-radio name="2">解冻</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-button type="info" v-if="powerid != ''" class="sub" @click="submits"
        >执行</van-button
      >
      <van-button type="info" v-else class="sub" @click="submits" disabled
        >执行</van-button
      >
    </div>

    <!-- 更新角色名   未完成 -->
    <!-- <div v-else-if="$route.params.id == 11">
      <van-nav-bar
        left-text="返回"
        left-arrow
        title="更新角色"
        class="head"
        @click-left="onClickLeft"
      /> -->
      <!-- 获取所有角色 -->
      <!-- <van-field
        readonly
        clickable
        name="picker"
        :value="value"
        label="选择角色"
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
      </van-popup> -->
      <!-- 输入新角色名 -->
      <!-- <van-cell-group>
        <van-field
          v-model="username"
          label="角色名"
          placeholder="请输入新角色名"
        />
      </van-cell-group>
      <van-button
        type="info"
        v-if="value != '' && username != ''"
        class="sub"
        @click="submits"
        >更新角色</van-button
      >
      <van-button type="info" v-else class="sub" @click="submits" disabled
        >更新角色</van-button
      >
    </div> -->

    <!-- 删除角色 -->
    <div v-else-if="$route.params.id == 5">
      <van-nav-bar
        left-text="返回"
        left-arrow
        title="删除角色"
        class="head"
        @click-left="onClickLeft"
      />
      <van-field
        readonly
        clickable
        name="picker"
        :value="value"
        label="选择角色"
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
      <van-button type="info" v-if="value != ''" class="sub" @click="submits"
        >删除角色</van-button
      >
      <van-button type="info" v-else class="sub" @click="submits" disabled
        >删除角色</van-button
      >
    </div>

    <!-- 更新角色  权限- 未完成-->
    <!-- <div v-else-if="$route.params.id == 7">
       <van-nav-bar
        left-text="返回"
        left-arrow
        title="更新角色"
        class="head"
        @click-left="onClickLeft"
      />
      <van-field
        readonly
        clickable
        label="角色"
        :value="value"
        placeholder="选择角色"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          value-key
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirmRole"
        />
      </van-popup> -->
      <!-- 权限 -->
<!--      
    <p v-for="(item, keys) in power_obj" :key="keys">
      <van-button plain type="info">{{ item }}</van-button>
    </p>

    </div> -->
  </div>
</template>
<script>
import timetype from "../../untils";

export default {
  data() {
    return {
      show: "",
      showtitle: "",
      result: [],
      list: [],
      checked: true,
      select: [],
      option: "",
      powerid: "",
      showcontent: false,
      showsub: "",
      radio: "",
      value: "",
      columns: [],
      showPicker: false,
      username: "",
      tel: "",
      values: "",
      showPickers: false,
      sexvalue: "1",
      date: "", //时间
      showtime: false,
      list_department_id: {},
      columns_role_id: {},
      role_id: "",
      power_obj: {},
      role_power: {},
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      depart_id:""
    };
  },
  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    onClickLeft() {
      this.$router.push({
        path: "/about",
      });
    },
    onConfirm(value) {
      this.value = value;
      this.showPicker = false;
      // console.log(this.value)
    },
    onConfirms(value) {
      this.values = value;
      this.showPickers = false;
      // console.log(value)
      for (let x in this.list_department_id) {
        if (this.list_department_id[x] == value) {
          // console.log(x)
          this.depart_id = x;
        }
      }


    },
    onConfirmRole(value) {
      this.value = value;
      this.showPicker = false;
      // console.log(this.value)
      //拿角色ID
      for (let x in this.columns_role_id) {
        if (this.columns_role_id[x] == this.value) {
          this.role_id = x;  //角色ID
        }
      }
      // console.log(this.role_id)
      //角色ID对应的权限
      this.$axios.get({
        url: "/role/permissions",
        params: {
          rid: this.role_id
        }
      }).then(
        res => {
          if (res instanceof Array) {
            //获取到数据
            console.log(res)
          }
          if (res && res.code && res.code == "-2") {
            //用户不存在
            console.log('角色不存在')
          } 
        }
      )
    },
    checkAll() {
      this.$refs.checkboxGroup.toggleAll(true);
    },
    toggleAll() {
      this.$refs.checkboxGroup.toggleAll();
    },
    formatDate(date) {
      //时间格式
      return `${date.getFullYear()}-${Number(
        date.getMonth() + 1
      )}-${date.getDate()}`;
    },
    onConfirmss(date) {
      this.showtime = false;
      this.date = this.formatDate(date);
    },

    submits() {
      switch (this.$route.params.id) {
        case "4":
          // 新建角色
          this.showtitle = "新建角色";
          this.Toast.loading({
            message: "创建中...",
            forbidClick: true,
          });
          // console.log('result --------','[' + String(this.result) + ']')
          this.$axios
            .post({
              url: "/role/add",
              data: {
                roleName: this.value,
                roleids: "[" + String(this.result) + "]",
              },
            })
            .then((res) => {
              if (res.code == "0") {
                this.Toast.success("创建成功");
                this.$router.push({
                  path: "/about",
                });
              } else {
                this.Toast.fail("创建失败");
              }
            });
          break;
        case "6":
          // console.log("---power----", this.powerid);
          this.showtitle = "查询权限";
          this.$axios
            .post({
              url: "/role/find",
              data: {
                roleid: this.powerid,
              },
            })
            .then((res) => {
              // console.log(res);
              if (res.roleid) {
                this.showsub = res.role_name;
                this.showcontent = true;
              } else if (res && res.code == "-3") {
                this.Toast.fail("未查询到该权限");
              } else {
                this.Toast.fail("查询失败");
              }
            });
          break;
        case "13":
          // this.showtitle = "添加用户";
          let role_id = 0,
            department_ids = 0;
          for (let x in this.columns_role_id) {
            if (this.columns_role_id[x] == this.value) {
              role_id = x;
            }
          }
          for (let x in this.columns_role_id) {
            if (this.list_department_id[x] == this.values) {
              department_ids = x;
            }
          }
          // console.log(role_id, department_ids, new Date(this.date).getTime());
          this.$axios
            .post({
              url: "/user/add",
              data: {
                phone: this.tel,
                rid: role_id,
                username: this.username,
                sex: this.sexvalue,
                induction_time: new Date(this.date).getTime(),
                department_id: this.depart_id,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.code == "0") {
                //添加成功
                this.Toast.success("添加成功");
                this.$router.push({
                  path: "/about",
                });
              } else if (res.code == "-21") {
                this.Toast.fail("手机号已存在");
              } else if (res.code == "-20") {
                this.Toast.fail("请输入正确的手机号");
              } else {
                this.Toast.fail("添加失败,请重试");
              }
            });
          break;
        case "14":
          this.$axios
            .post({
              url: "/user/freeze",
              data: {
                uid: "[" + this.powerid + "]",
                option: this.sexvalue,
              },
            })
            .then((res) => {
              if (res.code == "0") {
                //
                this.Toast.success("操作成功");
                this.$router.push({
                  path: "/about",
                });
              } else {
                this.Toast.fail("操作失败，请重试");
              }
              console.log(res);
            });
        case "11":
          for (let x in this.columns_role_id) {
            if (this.columns_role_id[x] == this.value) {
              this.role_id = x; //角色ID
            }
          }
          console.log(this.role_id);
          break;
        case "5":
          this.Dialog.confirm({
            title: "删除角色",
            message: "确认删除？删除操作不可逆！！！",
          })
            .then(() => {
              this.Toast.loading({
                message: "删除中...",
                forbidClick: true,
              });
              for (let x in this.columns_role_id) {
                if (this.columns_role_id[x] == this.value) {
                  this.role_id = x; //角色ID
                }
              }
              this.$axios
                .get({
                  url: "/role/del",
                  params: {
                    roleid: this.role_id,
                  },
                })
                .then((res) => {
                  if (res.code == "0") {
                    this.Toast.success("删除成功");
                    this.$router.push({
                      path: "/about",
                    });
                  } else if (res.code == "-3") {
                    this.Toast.fail("该角色不存在");
                  } else {
                    this.Toast.fail("删除失败");
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
            break;
        case "7":
            //  this.value

      }
    },
  },
  mounted() {
    switch (this.$route.params.id) {
      case "4":
        this.showtitle = "创建角色";
        this.$axios
          .get({
            url: "/role/select", //所有权限
          })
          .then((res) => {
            this.option = res;
            console.log(res);
          });
        break;
      case "13":
        this.$axios
          .get({
            url: "/role/select_role", //所有角色
          })
          .then((res) => {
            this.select = res;

            res.forEach((it) => {
              this.columns.push(it.role_name);
              this.columns_role_id[it.roleid] = it.role_name;
            });
            // console.log(this.columns_role_id)
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
            console.log(this.list_department_id)
          });
        break;
      case "11":
        this.$axios
          .get({
            url: "/role/select_role", //所有角色
          })
          .then((res) => {
            this.select = res;
            res.forEach((it) => {
              this.columns.push(it.role_name);
              this.columns_role_id[it.roleid] = it.role_name;
            });
          });
        break;
      case "5":
        this.$axios
          .get({
            url: "/role/select_role", //所有角色
          })
          .then((res) => {
            this.select = res;
            res.forEach((it) => {
              this.columns.push(it.role_name);
              this.columns_role_id[it.roleid] = it.role_name;
            });
            console.log(this.columns);
          });
        break;
      case "15":
        this.$axios
          .get({
            ///department/selectuser
            url: "/department/select",
          })
          .then((res) => {
            console.log(res);
          });
        break;
      case "7":
        this.$axios
          .get({
            url: "/role/select_role", //所有角色  colums
          })
          .then((res) => {
            this.select = res;
            res.forEach((it) => {
              this.columns.push(it.role_name);  //名
              this.columns_role_id[it.roleid] = it.role_name; //ID
            });
          });
        this.$axios.get({     //获取所有权限
          url: "/role/select"    
        }).then(
          res => {
            this.list = res;
            res.forEach((power, keys) => {   
              this.result.push(power.pname);   //权限名   result
              this.power_obj[keys][power.pid] = power.pname;//权限ID  
              
            })
            // console.log(this.result)
            console.log( this.power_obj)
          }
        )
            
            
            // res.forEach((roe) => {
            //   let obj = {values: roe.role_name, defaultIndex: roe.roleid};
            //   this.columns.push(obj)
            // });
            // console.log(this.columns)
         
    }
  },
};
</script>

<style lang="less" scoped>
.selet_role_info {
  text-align: center;
  .pop_box {
    width: 80%;
    height: 20vh;
    line-height: 20vh;
    font-size: 1.2rem;
    text-align: center;
    border-radius: 1rem;
  }
}

.head {
  line-height: 5vh;
}

.content {
  padding: 16px 16px 160px;
}

.department {
  padding-top: 1rem;
  font-size: 1rem;
}

.btn {
  // width: 90%;
  margin: 1rem auto;
  font-size: 1.1rem;
  border-radius: 4rem;
  padding-bottom: 1rem;
}

.new_role {
  font-size: 1.2rem;
}
.btnsubmit {
  border-radius: 4rem;
  margin: 1rem auto;
  display: block;
  width: 95%;
}
.sub {
  //提交按钮
  margin: 0.8rem auto;
  display: block;
  width: 95%;
  border-radius: 4rem;
  font-size: 1rem;
}

.new_roles {
  font-size: 1.1rem;
}
</style>