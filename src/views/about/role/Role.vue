<template>
  <div class="btn">
    <van-nav-bar
      left-text="返回"
      right-text="添加"
      left-arrow
      title="角色"
      class="head"
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <!-- <h1>{{ columns_role_id }}</h1> -->
    <van-cell-group class="box" inset title=" ">
      <!-- 权限ID -->
      <van-cell v-for="(item,keys) in columns_role_id" :key="keys" class="pow" is-link @click="roleclick(keys)" :title="item"  size="large" />
    </van-cell-group>   
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: [],
      powerid: "",
      value: "",
      columns: [],
      list_department_id: {},
      columns_role_id: {},
      role_id: "",
      power_obj: {},
      role_power: {},
    };
  },

  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/about",
      });
    },

    onClickRight() {
      // this.Toast('点了添加');
      this.$router.push({
        path: "/about/role/add",
      });
    },

    roleclick(keys) {  
      this.$router.push({
        path:"/about/role/alter/" + keys
      })
    }
  },
  mounted() {
    this.$axios
      .get({
        url: "/role/select_role", //所有角色  colums
      })
      .then((res) => {
        
        let result = {};

        for (let x = 0; x < res.length; x++) {
          result[res[x].roleid] = res[x].role_name;
        }
        this.columns_role_id = result;

      });
  },
};
</script>



<style lang="less" scoped>
.box {
 
  background-color: transparent;
  .role {
    padding: 1.5rem;
    color: #34a0a4;
    font-weight: bold;
    background-color: #8ecae6;
    border-radius: 0.5rem;
    margin-top: 1rem;
  }
}
.pow {
  background-color: #bbdefb;
  font-weight: bold;
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #000;
}

.head {
  height: 7vh;
}

.btn {
  padding-top: 7vh;
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>