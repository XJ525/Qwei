<template>
  <div>
    <van-nav-bar left-text="返回"
                 left-arrow
                 title="修改角色"
                 class="head"
                 @click-left="onClickLeft" />
    <!-- <h1>角色ID{{ $route.params.id }}</h1> -->
    <!-- 输入新角色名 -->
    <van-cell-group>
      <van-field v-model="username"
                 label="角色名"
                 maxlength="9"
                 placeholder="请输入新角色名" />
    </van-cell-group>

    <div class="checkbox">
      <!-- {{ state }} -->
      <div v-for="(it, k) in allpower"
           :key="k"
           class="btn">
        <van-button v-if="state[k] == '1'"
                    plain
                    type="info"
                    class="checked"
                    :data-key="k"
                    ref="yess"
                    @click="switchs">{{ it }}</van-button>
        <van-button v-else
                    plain
                    ref="yess"
                    :data-key="k"
                    type="info"
                    class="nochecked"
                    @click="switchs">{{ it }}</van-button>
      </div>
    </div>
    <div class="sub">
      <van-button type="info"
                  v-if="username != ''"
                  class="subm"
                  @click="submits">更新角色</van-button>
      <van-button type="info"
                  v-else
                  class="subm"
                  @click="submits"
                  disabled>更新角色</van-button>
    </div>
  </div>
</template>



<script>
export default {
  data () {
    return {
      power: {}, //已有权限
      allpower: {}, //全部权限
      state: {}, //拥有权限情况
      username: "",
    };
  },
  methods: {
    switchs () {
      //按钮颜色切换
      //   console.log(this.state)
      this.$refs.yess.forEach((item, key) => {
        if (item == event.target) {
          let cal = item.getAttribute("class");
          let cals = item.getAttribute("data-key");

          if (cal.indexOf("nochecked") >= 0) {
            //未选中
            item.setAttribute(
              "class",
              "checked van-button van-button--info van-button--normal van-button--plain"
            );
          } else if (cal.indexOf("checked") >= 0) {
  
            item.setAttribute(
              "class",
              "nochecked van-button van-button--info van-button--normal van-button--plain"
            );
          }
        }
      });
    },
    onClickLeft () {
      this.$router.push({
        path: "/about/role",
      });
    },
    submits () {
      //更新角色名，修改权限组
      this.Toast.loading({
        message: "修改中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });
      this.$axios
        .post({
          url: "/role/update",
          data: {
            roleid: this.$route.params.id,
            role_name: this.username,
          },
        })
        .then((res) => {
          console.log(res);
          if (res && res.code && res.code == "0") {
            //成功
            // console.log("成功")
            let arr = [];
            this.$refs.yess.forEach((it, k) => {
              let cal = it.getAttribute("class");

              //   console.log(it.getAttribute('class')) //class
              //   console.log(it.getAttribute('data-key')) //id
              if (cal.indexOf("nochecked") < 0) {
                //被选中的
                arr.push(it.getAttribute("data-key"));
              }
            });
            // console.log(arr); //获取到数组
            //修改角色权限
            this.$axios
              .post({
                url: "role_and_perm/alter",
                data: {
                  rid: this.$route.params.id,
                  data: "[" + arr + "]",
                },
              })
              .then((rest) => {
                // console.log(rest)
                if (rest && rest.code == "0") {
                  // console.log("成功")
                  this.Toast.success("更新角色成功");
                  this.$router.push({
                    path: "/about/role",
                  });
                  return;
                } else {
                  this.Toast.fail("更新角色失败");
                }
              });
          } else {
            // 更新角色失败
            this.Toast.fail("更新角色失败");
          }
        });
    },
  },
  mounted () {
    //查询角色名
    this.$axios
      .post({
        url: "/role/find",
        data: {
          roleid: this.$route.params.id,
        },
      })
      .then((res) => {
        if (res && res.role_name) {
          this.username = res.role_name;
        } else {
          //获取角色失败
          this.Toast.fail("获取角色失败");
          return;
        }
      });
    //获取全部权限
    let role_state = {};
    this.$axios
      .get({
        url: "/power/select", //所有权限
      })
      .then((res) => {
        // console.log(res)
        if (res instanceof Array) {
          let result = {};
          res.forEach((it) => {
            if (it.pid > 0 && it.parent_id >= 0) {
              result[it.pid] = it.pname; //对象 id 权限名
              role_state[it.pid] = "0";
            }

          });
          console.log(result);
          this.allpower = result;
          //传过来的角色ID  获取单个角色有的权限
          // console.log(this.$route.params.id);
          this.$axios
            .get({
              url: "/role/permissions",
              params: {
                rid: this.$route.params.id,
              },
            })
            .then((rest) => {
              if (rest && rest.code && rest.code == "-2") {
                this.Toast.fail("该角色没有权限");
                return;
              } else if (rest instanceof Array) {
                // console.log(res)
                let result = {};
                rest.forEach((item) => {
                  result[item.pid] = item.pname;
                  role_state[item.pid] = "1";
                });
                this.power = result;
                this.state = role_state;
              } else {
                this.Toast.fail("获取角色信息错误");
              }
            });
        } else {
          this.Toast.fail("该角色无权限");
        }

        // console.log(this.allpower);
      });

    console.log(this.state);
    //判断哪些权限有 哪些没有  //利用属性  直接新生成一个对象
  },
};
</script>

<style lang="less" scoped>
.checkbox {
  width: 90%;
  margin: 0 auto;
}
.btn {
  width: 50%;
  float: left;
  text-align: center;
}
.checked {
  color: #000;
  margin-top: 1rem;
  width: 80%;
  background-color: #93caf6;
  border: none;
}
.sub {
  text-align: center;
}
.subm {
  width: 90%;
  margin-top: 2rem;
  font-size: 1rem;
  border-radius: 4rem;
}

.nochecked {
  color: #8d99ae;
  margin-top: 1rem;
  width: 80%;
  background-color: #ebf2fa;
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>