<template>
  <div class="btn">
    <van-nav-bar
      left-text="返回"
      right-text=""
      left-arrow
      title="修改权限"
      class="head"
      :fixed="true"
      @click-left="onClickLeft"
    />
    <!-- <h1>修改权限{{ $route.params.id }}</h1> -->
    <van-cell-group>
      <van-field
        v-model="power_data.pname"
        label="权限名"
        placeholder="请输入权限名"
      />
    </van-cell-group>
    <!-- {{ power_data.purl }} -->
    <van-cell-group>
      <van-field
        v-model="power_data.purl"
        label="权限C/A"
        placeholder="请输入权限C/A"
      />
    </van-cell-group>

    <van-field
      readonly
      clickable
      label="父级菜单"
      :value="value"
      placeholder="选择父级菜单"
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
      v-if="power_data.pname != ''"
      type="info"
      class="sub"
      @click="submits"
      >修改</van-button
    >
    <van-button v-else type="info" class="sub" disabled>修改</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
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
      this.Toast.loading({
        message: "修改中...",
        forbidClick: true,
        duration: 0,
      });
      this.$axios
        .post({
          url: "/power/update",
          data: {
            pid: this.$route.params.id,
            pname: this.power_data.pname,
            purl: this.power_data.purl,
            parentid: this.parentid,
          },
        })
        .then((res) => {
          if (res.code == "0") {
            this.Toast.success("修改成功");
            this.$router.push({
                path: "/about/power"
            })
          } else {
            this.Toast.fail("修改失败");
          }
        });
    },
  },
  mounted() {
      
    //   /power/find
    // console.log(this.$route.params.id)
    this.$axios
      .post({
        url: "/power/find",  //查询权限
        data: {
          pid: this.$route.params.id,
        },
      })
      .then((res) => {
        if (res && res.pid || (res.pid == 0)) {
          //请求成功
          this.power_data = res;
          
       
          
        } else {
          //获取失败
          this.Toast.fail("请求失败");
        }
        console.log(555,this.power_data);
      });

    this.$axios
      .get({
        url: "/power/select",  //查询系统所有权限
      })
      .then((res) => {
        if (res instanceof Array) {
          let obj = {};
          res.forEach((item, key) => {
            
            obj[item.pid] = item.pname;
            this.power_arr.push(item.pname);
          });
          obj[0] = "显示菜单";
          this.power_arr.splice(0, 0, "显示菜单")
          this.power_obj = obj;
          // this.$route.params.parentid  //父级id
        
         //选项框的值
          for (let x in this.power_obj) {  //获取父级ID  查找对应名字回显
              if (this.$route.params.parentid == x) {  
                  this.value = this.power_obj[x];
              }
          }
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

