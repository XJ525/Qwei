<template>
  <div class="btn">
    <van-nav-bar
      left-text="返回"
      right-text="添加"
      left-arrow
      title="权限"
      class="head"
      :fixed="true"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <van-cell-group class="box" inset title=" ">
      <!-- 角色ID -->
     

      <van-cell class="power" v-for="(item, keys) in powers" :key="keys" is-link @click="roleclick(item.pid,item.parent_id)" :title="item.pname" size="large" />
  
    </van-cell-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
        powers: {},
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
        path: "/about/power/add",
      });
    },

    roleclick(pid,keys) {
      this.$router.push({
        path: "/about/power/alter/" + pid + "/" +keys,
      });
    },
  },
  mounted() {
    this.$axios.get({
      url: "/power/select", //所有权限
    }).then(
        res => {
            this.powers = res;
        
            console.log(res)
        }
    )
  },
};
</script>

<style lang="less" scoped>
.btn {
    padding-top: 5vh;
    padding-bottom: 5vh;
    height: auto;
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>