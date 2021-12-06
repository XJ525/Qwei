
<template>
  <div class="management">

   
    <van-nav-bar
      title="添加"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

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

    <van-form @submit="onSubmit ">
      <van-field
        v-model="department"
        name="department"
        label="部门"
        placeholder="部门"
        :rules="[{ required: true, message: '请填写要添加的部门' }]"
      />

      <van-cell   title="负责人"
                  is-link  
                  @click="showPopup"
                  :center="true"
                  arrow-direction="down"
                  :required="true"
                  :value="puser"
                  value-class="left"
                  title-class="right"
                  >
                  <span>{{ puser }}</span>
                
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
  name: "Management",
  data() {
    return {
        department: "",
        principal: "",
        show: false,
        columns: [],
        alluser:[],
        principalval:'',
        puser:"请选择"
    };
  },

  mounted() {
      this.$axios.get({
          url:"/department/selectuser",
      }).then(
          ress => {
              // console.log(ress)
              this.alluser = ress;
              for(let x = 0; x < ress.length;x++) {
                  this.columns.push(`${ress[x].user_id}:${ress[x].username}`);
              }
              
          }
      )
  },

  methods: {
    onSubmit(values) {
    console.log(values.department, this.principalval)
      this.$axios.post({
          url:"/department/add",
          data:{
              name:values.department,
              head_id:this.principalval
          }
      }).then(
          res => {
              if (res && res.code && res.code == 0) {
                  this.$toast(this.department+'创建成功!')
                  this.$router.replace('/departmentadmin')
              }

              if (res && res.code && res.code != 0) {
                  this.Toast.fail(this.department+'部门已存在!')
              }
          }
      )
    },

    //弹出层
    showPopup() {
      this.show = true;
    },

    //选项操作
    onConfirm(value, index) {
        this.show = false;
        // this.$toast(`当前值：${value}, 当前索引：${index}`);
        for(let x = 0;x < this.alluser.length; x++) {

            let uid = value.slice(0, value.indexOf(":"));
            
            if (uid == this.alluser[x]['user_id']) {
                this.puser = this.alluser[x].username;
                this.principalval = uid;
                // console.log(this.principal)
            }
        }
        
    },
    onChange(picker, value, index) {
       for(let x = 0;x < this.alluser.length; x++) {

            let uid = value.slice(0, value.indexOf(":"));
            
            if (uid == this.alluser[x]['user_id']) {
                this.puser = this.alluser[x].username;
                this.principalval = uid;
            }
        }
        this.$toast(`当前选择：${value}`);
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
/* .left {
  text-align: left;

} */
.management {
  height: 100vh;
}

.right {
  width: 3.125rem;
}



/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>
