<template>
  <div>
    <div class="btn">
      <van-nav-bar left-text="返回"
                   left-arrow
                   title="添加用户"
                   class="head"
                   @click-left="onClickLeft" />
      <van-field v-model="tel"
                 type="tel"
                 label="手机号"
                 placeholder="请输入手机号" />
      <van-cell-group>
        <van-field v-model="username"
                   label="姓名"
                   maxlength="20"
                   placeholder="请输入真实姓名" />
      </van-cell-group>

      <van-field name="radio"
                 label="性别">
        <template #input>
          <van-radio-group v-model="sexvalue"
                           direction="horizontal">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- 角色 -->
      <van-field readonly
                 clickable
                 name="picker"
                 :value="value"
                 label="角色"
                 placeholder="点击选择角色"
                 @click="showPicker = true" />
      <van-popup v-model="showPicker"
                 position="bottom">
        <van-picker show-toolbar
                    :columns="columns"
                    @confirm="onConfirm"
                    @cancel="showPicker = false" />
      </van-popup>
      <!-- 选择部门 -->
      <van-field readonly
                 clickable
                 name="picker"
                 :value="values"
                 label="部门"
                 placeholder="点击选择部门"
                 @click="showPickers = true" />
      <van-popup v-model="showPickers"
                 position="bottom">
        <van-picker show-toolbar
                    :columns="list"
                    @confirm="onConfirms"
                    @cancels="showPickers = false" />
      </van-popup>
      <!-- 入职时间 -->
      <van-cell title="入职时间"
                :value="date"
                @click="showtime = true" />

      <van-calendar v-model="showtime"
                    color="#1989fa"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="onConfirmss" />

      <van-button type="info"
                  v-if="tel != '' && username != '' && sexvalue != '' && value != '' && values != '' && date != ''"
                  class="sub"
                  @click="submits">提交</van-button>
      <van-button v-else
                  type="info"
                  class="sub"
                  @click="submits"
                  disabled>提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
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
      depart_id: "",
    };
  },
  methods: {
    toggle (index) {
      this.$refs.checkboxes[index].toggle();
    },
    onClickLeft () {
      this.$router.push({
        path: "/about/user",
      });
    },
    onConfirm (value) {
      this.value = value;
      this.showPicker = false;
      // console.log(this.value)
    },
    onConfirms (value) {
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
    onConfirmRole (value) {
      this.value = value;
      this.showPicker = false;
      // console.log(this.value)
      //拿角色ID
      for (let x in this.columns_role_id) {
        if (this.columns_role_id[x] == this.value) {
          this.role_id = x; //角色ID
        }
      }
      // console.log(this.role_id)
      //角色ID对应的权限
      this.$axios
        .get({
          url: "/role/permissions",
          params: {
            rid: this.role_id,
          },
        })
        .then((res) => {
          if (res instanceof Array) {
            //获取到数据
            console.log(res);
          }
          if (res && res.code && res.code == "-2") {
            //用户不存在
            console.log("角色不存在");
          }
        });
    },
    checkAll () {
      this.$refs.checkboxGroup.toggleAll(true);
    },
    toggleAll () {
      this.$refs.checkboxGroup.toggleAll();
    },
    formatDate (date) {
      //时间格式
      return `${date.getFullYear()}-${Number(
        date.getMonth() + 1
      )}-${date.getDate()}`;
    },
    onConfirmss (date) {
      this.showtime = false;
      this.date = this.formatDate(date);
    },

    submits () {
      if (this.username.trim() == '') {
        this.Toast({
          message: '用户名不能未空',
          position: 'bottom',
        });
        return;
      }

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
      // console.log(this.tel,role_id,this.username,this.sexvalue,new Date(this.date).getTime(),this.depart_id)
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
            setTimeout(() => {
              this.$router.push({
                path: "/about/user",
              });
            }, 1000);
          } else if (res.code == "-21") {
            this.Toast.fail("手机号已存在");
          } else if (res.code == "-20") {
            this.Toast.fail("请输入正确的手机号");
          } else {
            this.Toast.fail("添加失败,请重试");
          }
        });
    },
  },
  mounted () {
    this.$axios
      .get({
        url: "/role/select_role", //所有角色
      })
      .then((res) => {
        this.select = res;
        console.log(res);
        if (res instanceof Array) {
          res.forEach((it) => {
            this.columns.push(it.role_name);
            this.columns_role_id[it.roleid] = it.role_name;
          });
        }

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

        if (res instanceof Array) {
          res.forEach((item) => {
            department_obj.push(item.name);
            department_objs[item.department_id] = item.name;
          });
          this.list = department_obj;
          this.list_department_id = department_objs;
          console.log(this.list_department_id);
        }
      });
  },
};
</script>

<style lang="less" scoped>
.sub {
  //提交按钮
  margin: 0.8rem auto;
  display: block;
  width: 95%;
  border-radius: 4rem;
  font-size: 1rem;
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>