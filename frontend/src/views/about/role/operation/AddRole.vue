<template>
  <div class="btn">
    <van-nav-bar left-text="返回"
                 left-arrow
                 title="新建角色"
                 class="head"
                 :fixed="true"
                 @click-left="onClickLeft" />
    <van-cell-group title="角色名">
      <van-field v-model="value"
                 class="new_role"
                 label="角色名"
                 maxlength="9"
                 placeholder="请输入角色名" />
    </van-cell-group>

    <van-checkbox-group class=""
                        v-model="result">
      <van-cell-group title="选择权限">
        <van-cell v-for="(item, index) in option"
                  clickable
                  class="new_roles"
                  :key="item.pid"
                  :title="` ${item.pname}`"
                  @click="toggle(index)">
          <template #right-icon>
            <van-checkbox :name="item.pid"
                          ref="checkboxes" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <van-button v-if="result.length != 0 && value != ''"
                @click="submits"
                type="info"
                class="submit">提交</van-button>
    <van-button v-else
                type="info"
                class="submit"
                disabled>提交</van-button>
    <!-- <p>已选择{{ result }}</p> -->
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
    };
  },
  methods: {
    onClickLeft () {
      this.$router.push({
        path: "/about/role",
      });
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle();
    },
    submits () {
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
              path: "/about/role",
            });
          } else {
            this.Toast.fail("创建失败");
          }
        });
    },
  },
  mounted () {
    this.showtitle = "创建角色";
    this.$axios
      .get({
        url: "/power/select", //所有权限
      })
      .then((res) => {
        let arr = []
        if (res && Array.isArray(res)) {
          res.forEach(item => {
            if(item.parent_id >= 0 || item.pid == '-1') {
              arr.push(item);
              //  this.option = res;
            }
           


          });

        }
        console.log(res);
            this.option = arr;

        console.log(res);
      });
  },
};
</script>


<style lang="less" scoped>
.btn {
  padding-top: 5vh;
  padding-bottom: 5vh;
}

/deep/ .submit {
  //提交按钮
  margin: 1rem auto;
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