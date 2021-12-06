<template>
  <div class="btn">
    <van-nav-bar
      left-text="返回"
      right-text=""
      left-arrow
      title="添加权限"
      class="head"
      :fixed="true"
      @click-left="onClickLeft"
    />
    <!-- <h1>添加权限{{ $route.params.id }}</h1> -->
    <van-cell-group>
      <van-field v-model="pname" label="权限名" maxlength="20" placeholder="请输入权限名" />
    </van-cell-group>
    <van-cell-group>
      <van-field v-model="purl" label="权限C/A" placeholder="请输入权限C/A" />
    </van-cell-group>

    <van-field
      readonly
      clickable
      label="父级菜单"
      :value="value"
      placeholder="选择父级url"
      @click="showPicker = true"
    />
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        value-key
        :columns="power_arr"
        @cancel="showPicker = false"
        @confirm="onConfirmRole"
      />
    </van-popup>
    <van-button
      v-if="pname != '' && value != ''"
      type="info"
      class="sub"
      @click="submits"
      >添加</van-button
    >
    <van-button v-else type="info" class="sub" disabled>添加</van-button>
  </div>
</template>

<script>
import power from "../../../router/about/power/power";
export default {
  data() {
    return {
      pname: "", //权限名
      purl: "", //C/A
      value: "", //父级菜单值
      power_data: {},
      power_obj: {},
      power_arr: [],
      showPicker: false,
      parentid: "",
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/about/power",
      });
    },
    onConfirmRole(value) {
      this.value = value;
      this.showPicker = false;
      //获取对应的ID

      for (let x in this.power_obj) {
        if (this.power_obj[x] == value) {
          this.parentid = x;
        }
      }
    },
    submits() {
      // //拦截，不允许已经存在的权限名创建
      // console.log(this.power_arr)
      for (let x in  this.power_arr) {
          console.log(this.power_arr[x],this.pname)
          if (this.power_arr[x] == this.pname) {
            this.Toast.fail("不允许创建已有的权限");
            return;
        }
      }
        
      

      this.Toast.loading({
        message: "添加中...",
        forbidClick: true,
        duration: 0,
      });
      this.$axios
        .post({
          url: "/power/add",
          data: {
            pname: this.pname,
            purl: this.purl,  //
            parentid: this.parentid,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.Toast.success("添加成功");
            this.$router.push({
              path: "/about/power",
            });
          } else if (res.code == "-8"){
            this.Toast.fail("权限名已经存在");
          } else {
            this.Toast.fail("添加失败");
          }
        });
    },
  },
  mounted() {
    //   /power/find

    // this.$axios
    //   .post({
    //     url: "/power/find",
    //     data: {
    //       pid: this.$route.params.id,
    //     },
    //   })
    //   .then((res) => {
    //     // console.log(res)
    //     if (res && res.pid) {
    //       //请求成功
    //       this.power_data = res;
    //     } else {
    //       //获取失败
    //       this.Toast.fail("请求失败");
    //     }
    //     console.log(this.power_data);
    //   });

    this.$axios
      .get({
        url: "/power/select",
      })
      .then((res) => {
        console.log(res);
        if (res instanceof Array) {
          let obj = {};
          res.forEach((item, key) => {
            // console.log(item)
            obj[item.pid] = item.pname;
            this.power_arr.push(item.pname);
          });
          obj[0] = "没有父级菜单";
          this.power_arr.splice(0, 0, "没有父级菜单");
          this.power_obj = obj;
          // console.log(this.power_arr)
        }
      });
  },
};
</script>


<style lang="less" scoped>
.btn {
  padding-top: 5vh;
  padding-bottom: 5vh;
  height: auto;
}
.sub {
  margin: 1.5rem auto;
  display: block;
  width: 95%;
  border-radius: 4rem;
  font-size: 1rem;
}
/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>

