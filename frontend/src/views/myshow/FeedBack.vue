<template>
  <div>
   <van-nav-bar
        left-text="返回"
        left-arrow
        title="意见反馈"
        class="head"
        @click-left="onClickLeft"
      />
    <van-cell-group>
      <van-field 
      v-model="value" 
      label="标题" 
      placeholder="请输入反馈" />
    </van-cell-group>

    <van-field
      v-model="message"
      rows="2"
      autosize
      label="反馈内容"
      type="textarea"
      maxlength="100"
      placeholder="描述一下您遇到的问题"
      show-word-limit
    />

    <van-button type="info" v-if="value != '' && message != ''" @click="submit" class="sub">提交</van-button>
    <van-button type="info" v-else class="sub" disabled>提交</van-button>


  </div>
</template>


<script>
export default {
  data() {
    return {
      value: "",
      message: ""
    };
  },
  methods: {
      submit() {
          this.Toast.success('反馈成功');
          this.$router.push({
              path: "/myshow"
          })
      },
      onClickLeft() {
        this.$router.push({
            path: "/myshow",
        });
    },
  }
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
    color:#000;
    font-size:1rem;
}
</style>
