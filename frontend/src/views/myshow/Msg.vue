<template>
  <div class="mymsg">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar
        title="我的资料"
        left-arrow
        class="nav"
        size="18"
        @click-left="onClickLeft"
      />
    </div>
    <!-- 信息 -->
    <div class="content">
      <van-cell-group title=" ">
        <van-field name="uploader" class="head_img" label="头像">
          <template #input>
            <van-uploader
              v-model="fileList"
              :after-read="afterRead"
              :max-count="1"
              :readonly="readonlys"
            />
          </template>
        </van-field>

        <van-field
          label="姓名"
          class="updata_read"
          v-model="username"
          readonly
        />

        <van-field
          label="昵称"
          class="updata_read"
          v-model="nickname"
          :readonly="readonlys"
          maxlength="6"
        />

        <van-field
          label="性别"
          class="updata_read"
          v-if="sex == 1"
          value="男"
          readonly
        />
        <van-field
          label="性别"
          class="updata_read"
          v-if="sex == 2"
          value="女"
          readonly
        />

        <van-field
          label="地址"
          class="updata_read"
          v-model="address"
          :readonly="readonlys"
        />

        <van-field
          label="入职时间"
          class="updata_read"
          v-model="induction_time"
          readonly
        />
        <van-field
          label="个性签名"
          class="updata_read"
          v-model="signature"
          :readonly="readonlys"
        />
        <van-field
          label="邮箱"
          class="updata_read"
          v-model="email"
          :readonly="readonlys"
        />
      </van-cell-group>

      <van-button
        v-if="readonlys == true"
        class="ifobtn"
        type="info"
        @click="updata_msg"
        >修改信息</van-button
      >
      <van-button v-else type="info" class="ifobtn" plain @click="complete_msg"
        >修改完成</van-button
      >
    </div>
  </div>
</template>

<script>
import untils from "../../untils";
export default {
  data() {
    return {
      username: "",
      nickname: "",
      sex: "",
      address: "",
      induction_time: "",
      signature: "",
      email: "",
      fileList: [],
      readonlys: true,
      result: "",
      avatar_url: "",
      user_head_url: "",
      uese_img: "",
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/myshow",
      });
    },

    afterRead(file) {
      // 此时可以自行将文件上传至服务器

      const formData = new FormData();
      formData.append("file", file.file);

      this.$axios
        .post({
          url: "/friends/ictures",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.code == 1) {
            // 上传头像成功  //图片地址
            this.user_head_url = res.data[0];
            let imgs = require('../../config').baseURL + "/imgs/temporary/" + res.data[0];

            //更新数据库信息
          }
        });
    },

    updata_msg() {
      console.log("修改信息");
      this.readonlys = false;
    },

    complete_msg() {
      console.log("完成修改");
      console.log(this.user_head_url);

      
      //判断信息是否修改
      if (
        this.result.address != this.address ||
        this.result.nickname != this.nickname ||
        this.result.signature != this.signature ||
        this.result.email != this.email ||
        this.result.user_head_url != this.user_head_url
      ) {
        //已经修改  请求
        this.Toast.loading({
          message: "修改中...",
          forbidClick: true,
          duration: 0,
        });
        
        this.$axios
          .post({
            url: "/user/upmessage",
            data: {
              nickname: this.nickname,
              address: this.address,
              signature: this.signature,
              email: this.email,
              headimg: this.user_head_url,
            },
          })
          .then((res) => {
            this.Toast.clear();
            if (res.code == "0") {
              this.Toast.success("修改成功");
              this.$router.push({
                path: "/myshow",
              });
            } else if (res.code == "-2" || res.code == "-3") {
              this.Toast.fail("数据格式有误，请检查数据是否补充完整");
              this.readonlys = false;
            } else {
              this.Toast.fail("修改失败");
              this.readonlys = false;
            }
          });
      } else {
        //未修改
        this.Toast({
          message: "并未修改任何信息",
          position: "bottom",
        });
      }
      this.readonlys = true;
    },
  },
  mounted() {
    // console.log(this.fileList);
    //
    this.$axios
      .get({
        url: "/user/mymessage",
      })
      .then((res) => {
        this.result = res.message;
        console.log(res);
        if (res.code == "1") {
          this.username = res.message.username;
          this.nickname = res.message.nickname;
          this.sex = res.message.sex;
          this.address = res.message.address;
          this.email = res.message.email;
          this.user_head_url = res.message.user_head_url;
          this.induction_time = untils.timeChangeDate(
            res.message.induction_time
          );
          this.signature = res.message.signature;
          let user_head_url = res.message.user_head_url ? res.message.user_head_url : 'head.png'
          this.uese_img =
            require('../../config').baseURL + "/imgs/temporary/" + user_head_url;

          this.fileList = [
            {
              url: this.uese_img,
            },
          ];
          this.Toast.clear();
          //请求成功
        } else if (res.code == "-6") {
          this.Toast.fail("未获取到您的信息");
          //未请求到数据，该用户不存在
          return;
        } else if (res.code == "-2") {
          this.Toast.fail("未获取到数据,请重试");
          //请求失败
          return;
        } else if (res.code == "-500") {
          //异地登陆
          return;
        }
      });
  },
};
</script>

<style lang="less" scoped>
.mymsg {
  height: 100vh;
}

.nav {
  height: 7vh;
}



/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}

.head {
  .nav {
    font-size: 1rem;
  }
}
.content {
  width: 95%;
  margin: 0 auto;
  text-align: center;

  .updata_read {
    padding-top: 1rem;
    font-size: 1rem;
  }

  .head_img {
    font-size: 1rem;
  }

  .ifobtn {
    width: 90%;
    margin: 1rem auto;
    border-radius: 4rem;
    font-size: 1rem;
  }
}
</style>
