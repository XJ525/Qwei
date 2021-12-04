
<template>
  <div class="altermanagement">

    <!-- --------------------------------导航栏 -->
    <van-nav-bar
      title="更改部门"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- --------------------------------导航栏 -->


    <!-----------------------------------员工组件 -->
    <van-popup 
        v-model="show" 
        position="bottom" 
        :style="{ height: '60%' }" 
    >
        <van-picker
            title="请选择"
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="onCancel"
            @change="onChange"
        />
    </van-popup>
    <!-----------------------------------员工组件 -->

    <van-form @submit="onSubmit ">
      <van-field
        v-model="department"
        name="department"
        label="部门"
        placeholder="部门"
        :rules="[{ required: true, message: '请填写要更改的部门' }]"
      />

      <van-cell   title="负责人"
                  is-link  
                  @click="showPopup"
                  :center="true"
                  arrow-direction="down"
                  :required="true"
                  :value="puser"
                  >
                
      </van-cell>
     
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: "Altermanagement",
  data() {
    return {
        department: "",
        principal: "",

        show: false,          //员工组件

        columns: [],      

        alluser:[],      //所有员工

        principalval:'', //提交user id
        departmentid:'',  //提交的部门id

        puser:"请选择"    //负责人名单
    };
  },

  async mounted() {
    
      //用户信息
    await this.$axios.get({
          url:"/department/selectuser",
      }).then(
          ress => {
           
              console.log(ress);
              this.alluser = ress;
              for(let x = 0; x < ress.length;x++) {
                  this.columns.push(ress[x].username);
              } 
          }
      );
      let datauser = this.$route.params;
      let alluser = this.alluser;
      // console.log(datauser)


      for (let x = 0; x < alluser.length; x++) {
        if (alluser[x].user_id == datauser.uid) {
            this.puser = alluser[x].username;
            this.department = datauser.name;

            this.departmentid = datauser.departmentid;
            this.principalval = datauser.uid;
        }
      }
  },

  methods: {
    onSubmit(values) {
    // console.log('部门id:'+this.departmentid, '部门名称:'+values.department, '负责人id:'+this.principalval)
      this.$axios.post({
          url:"/department/update",
          data:{
              department_id:this.departmentid,
              name:values.department,
              head_id:this.principalval
          }
      }).then(
          res => {
              if (res && res.code && res.code == 0) {
                  this.Toast.success('更改成功')
                  this.$router.replace('/departmentadmin')
              }

              if (res && res.code && res.code != 0) {
                  this.Toast.fail('更改失败')
              }
          }
      )
    },

    //员工弹出层
    showPopup() {
      this.show = true;
    },
    //员工选项操作
    onConfirm(value, index) {
        this.show = false
        // this.$toast(`当前值：${value}, 当前索引：${index}`);
        this.puser = value;

        for(let x = 0;x < this.alluser.length; x++) {
            if (value == this.alluser[x]['username']) {
                this.principal = this.alluser[x]['username'];
                this.principalval = this.alluser[x]['user_id'];
            }
        }   
    },
    onChange(picker, value, index) {
        this.$toast(`当前选择：${value}`);
        this.puser = value;
    },
    onCancel(picker, value, index) {  
        this.show = false
    },



    onClickLeft() {
      this.$router.push({
        path:"/departmentadmin"
      })
    }

  }
}


</script>

<style lang="less" scoped>

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>

