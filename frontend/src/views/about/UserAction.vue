<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      :title="show.title"
      left-text="返回"
      left-arrow
      class="head"
      @click-left="onClickLeft"
    />
    <h1>{{ $route.params.id }}</h1>

    <!-- 输入框 -->
    <div v-for="(item, index) in show.option" :key="index">
      <van-cell-group v-if="item.type == 'input'">
        <van-field
          class="inps"
          v-model="show.option[index].val"
          :label="item.title"
          :placeholder="'请输入' + item.title"
        />
      </van-cell-group>
    </div>

    <!-- 性别框 -->
    <div v-for="(item, index) in show.option" :key="item + index">
      <van-field name="radio" label="性别" v-if="item.type == 'sex'">
        <template #input>
          <van-radio-group
            v-model="show.option[index].val"
            direction="horizontal"
          >
            <span v-for="(option, keys) in item.arr" :key="option + keys">
              <van-radio :name="keys">{{ item.arr[keys] }}</van-radio>
            </span>
          </van-radio-group>
        </template>
      </van-field>
    </div>

    <!-- 单选框 -->
    <!-- <div v-for="(item, index) in show.option" :key="item.title + index">
      <van-field
        v-if="item.type == 'radio'"
        readonly
        clickable
        name="picker"
        :value="item.val"
        :label="item.title"
        :placeholder="'点击选择' + item.title"
        @click="showPicker = true"
      />
      {{ item.arr }}
      <van-popup v-model="showPicker" position="bottom">
          <van-picker :columns="item.arr"  @cancel="showPicker = false" />
      </van-popup>
    </div> -->

    <!-- 单选框 -->
    <!-- <div v-for="(item, index) in show.option" :key="item + index">
      <van-radio-group
        v-if="item.type == 'radio'"
        v-model="show.option[index].val"
      >
        {{ item.title }}
        <span v-for="(option, keys) in item.arr" :key="option + keys">
          <van-radio :name="keys">{{ item.arr[keys] }}</van-radio>
        </span>
      </van-radio-group>
    </div> -->

    <!-- 复选框 -->
    

    <!-- <div v-for="(item) in show.option" :key="item.phone"> -->
        <!-- <div v-if="item.type == 'radio'"> -->
            <!-- {{item}} -->
            <van-checkbox-group v-model="show.option[1].val">
                <van-cell-group>
                    <van-cell
                    v-for="(item, index) in show.option[1].arr"
                    clickable
                    :key="item + index"
                    :title="`复选框 ${item}`"
                    @click="toggle(index)"
                    >
                    <template #right-icon>
                        <van-checkbox :name="item" ref="checkboxes" />
                    </template>
                    </van-cell>
                </van-cell-group>
            </van-checkbox-group>
        <!-- </div> -->
    <!-- </div> -->
    
   

<!-- 
    <div v-for="(item, index) in show.option" :key="item + index">
        <van-checkbox-group v-if="item.type == 'radio'"  v-model="show.option[index].val">
            {{ item.title }}{{show.option[index].val}}
            <span v-for="(option, keys) in item.arr" :key="option + keys">
                <van-checkbox :name="keys">{{ item.arr[keys] }}</van-checkbox>
            </span>
        </van-checkbox-group>
    </div> -->

    
    <van-popup round v-model="reveal">
      <div class="con">
        查询结果：
        {{ msg }}
      </div>
    </van-popup>
  </div>
  <!-- </div> -->
</template>

<script>
//input 输入框
//sex  单选框组,性别
//radio  单选下拉框
//checkbox  多选框

export default {
  data() {
    return {
      blogList: {
        13: {
          id: "13", //传过来的ID
          title: "添加用户", //传过来的功能名
          option: [
            //可以利用属性控制单选还是多选
            {
              //选项1
              title: "手机号", //选项卡名  如：用户名
              arguments: "phone", //参数名
              arr: "", //参数可选值
              type: "input", //控制选项卡类型
              val: "",
            },
            {
              //选项2
              title: "角色ID",
              arguments: "rid",
              arr: [], //从后端获取到所有角色的选项
              type: "radio", //单选框
            //   val: "",
              val: [],
            },
            {
              title: "真实姓名",
              arguments: "username",
              arr: "", //用户填写的真实姓名
              type: "input",
              val: "",
            },
            {
              title: "性别",
              arguments: "sex",
              arr: { 1: "男", 2: "女" },
              type: "sex",
                val: "1",
            //   val: [],
            },
            {
              title: "部门",
              arguments: "induction_time",
              arr: [], //从后端获取的部门信息
              type: "radio",
            //   val: "",
              val: [],
            },
          ],
          btn: "创建用户",
        },
      },
      show: {
        id: "", //传过来的ID
        title: "", //传过来的功能名
        option: [
          //直接复制选项卡的内容
        ],
        btn: "",
      },
      
      reveal: false, //弹出层是否展示控制
      msg: "", //弹出层信息
      showPicker: false, //是否展示单选弹出框
      checkbox: false,
      checkboxGroup: [],
    };
  },
  // created() {
  //   let id = this.$route.params.id;

  // },
  methods: {
    //返回
    onClickLeft() {
      this.$router.push({
        path: "/about",
      });
    },
    //是否展示单选弹出框获得的信息
    onConfirm(value) {
      //   this.show = value;
      //   this.showPicker = false;
    },
    //提交
    commit() {
      switch (this.show.id) {
        case "1":
          this.$axios
            .post({
              url: "/power/add",
              data: {
                pname: this.show.val[0],
                purl: this.show.val[1],
              },
            })
            .then((res) => {
              if (res.code == "0") {
                //添加成功
                this.Toast.success("添加成功");
                this.$router.push({
                  path: "/about",
                });
              } else if (res.code == "-8") {
                //权限名或c/a已经存在
                this.Toast.fail("权限名或c/a已经存在");
              } else {
                //添加失败
                this.Toast.fail("添加失败");
              }
            });
          break;
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
  },
  mounted() {
    //利用传过来的id获取  //都是需要执行的
    console.log(this.$route.params.id);
    switch (this.$route.params.id) {
      case "13": //创建用户
        // this.show = this.blogList["13"];
        // console.log(this.show)

        //获取角色目录
        this.$axios
          .get({
            url: "/role/select_role",
          })
          .then((res) => {
            // console.log(res)
            let role_obj = [];
            res.forEach((item) => {
              role_obj.push(item.role_name);
            });
            this.blogList["13"].option[1].arr = role_obj;
            // console.log(role_obj)
            console.log(this.blogList["13"].option[1])
          });
        //获取部门目录
        this.$axios
          .get({
            url: "/department/select",
          })
          .then((res) => {
            // console.log(res)
            let department_obj = [];
            res.forEach((item) => {
                department_obj.push(item)
            //   department_obj[item.department_id] = item.name;
            });
            this.blogList["13"].option[4].arr = department_obj;
            // console.log(department_obj)
            console.log(this.blogList["13"].option[4].arr)
          });
        this.show = this.blogList["13"]; //数据绑定
        // console.log(this.show);
    }
    // this.$axios
    //   .post({
    //     url: "/power/find",
    //     data: {
    //       pid: this.$route.params.id,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });

    // console.log(this.$route.params.id);
    // console.log( this.blogList[0])

    // switch(this.$route.params.id) {
    //   case "1": this.show = this.blogList[0]; break;
    // }

    // this.$axios.post({
    //   url: '/power/find',
    //   data: {
    //     pid: this.pid
    //   }
    // }).then(
    //   res => {
    //     console.log(res)
    //   }
    // )
  },
};
</script>

<style lang="less" scoped>
.head {
  padding: 0.4rem;
}

.content {
  width: 95%;
  margin: 0.2rem auto;
  text-align: center;

  .inps {
    padding-top: 1rem;
    font-size: 1rem;
  }

  .btns {
    width: 90%;
    margin: 2.5rem auto;
    border-radius: 4rem;
    font-size: 1rem;
  }
  .con {
    width: 20rem;
    height: 20vh;
    font-size: 1.6rem;
    line-height: 20vh;
    text-align: center;
  }
}
</style>
