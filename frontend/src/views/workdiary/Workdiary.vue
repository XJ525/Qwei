<template>
  <div class="workdiary">
    <van-nav-bar
      title="工作日志"
      left-text="返回"
      left-arrow
      right-text="历史记录"
      @click-left="$router.push('/about')"
      @click-right="$router.push('/workhistory')"
    />

    <van-form @submit="onSubmit">
      <van-field
        v-model="content"
        name="content"
        
        placeholder="请输入日志内容"
        rows="8"
        maxlength="200"
        show-word-limit
        type="textarea"
        autosize
        spellcheck="false"
        :style="{
          margin: '2vh auto',
          width: '90%',
          borderRadius: '5px',
        }"
        :rules="[{ required: true, message: '请输入日志内容' }]"
      />

      <div style="margin: 16px">
        <van-button
          v-if="content != ''"
          round
          block
          class="vanbtn"
          type="info"
          native-type="submit"
          >提交</van-button
        >
         <van-button
          v-else
          round
          block
          type="info"
          class="vanbtn"
          disabled
          native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: "Workdiary",

  data() {
    return {
      content: "",
    };
  },

  methods: {
    onSubmit(values) {
      // console.log('submit', values);
      this.$axios
        .post({
          url: "/worklog/headid",
          data: {
            content: values.content,
          },
        })
        .then((res) => {
          if (res && res.code == 0) {
            this.$toast.success("提交成功");
            this.$router.replace("/about");
          } else {
            this.$toast.fail("提交失败");
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.vanbtn {
    margin-top: 1rem;
    font-size: 1rem;
}


/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>

