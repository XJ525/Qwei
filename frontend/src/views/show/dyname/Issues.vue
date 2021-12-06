<template>
  <div id="issues">
    <!-- 导航栏----------------------- -->
    <van-nav-bar
      title="分享"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-button type="primary" size="mini" @click="onClickRight" class="tit">发表</van-button>
      </template>
    </van-nav-bar>
    <!-- 导航栏------------------------ -->

    <div class="content">

      <!-- 输入框 ----------------------------------->
      <van-cell-group rows="5">
        <van-field
          type="textarea"
          rows="5"
          maxlength="200"
          v-model="value"
          placeholder="请输入你的内容"
          spellcheck='false'
          show-word-limit
          class="input_content"
        />
      </van-cell-group>
      <!-- 输入框 ---------------------------------->

      <!-- 图片视频上传 ---------------------------->
       <van-uploader 
        v-model="filefalse" 
        class="fliefalse"
      />
      <!-- 显示按钮组件 -->
      <van-cell  @click="showPopup" class="transfer"></van-cell>

      <!-- 显示视频 -->
      <div class="videobox"> 
          <video :src="vurl"  ref="refvideo"></video>
      </div>


      <!-- 视频图片点击事件 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="6"
          :after-read="afterRead"
          class="jvideo"
          v-if="judgeprlic"
          :before-read="beforeRead"
        >
          <van-cell-group>
            <van-cell center>
              <van-button type="info" class="picktrue" >选择照片</van-button>
            </van-cell>
          </van-cell-group >

        </van-uploader>

        <van-uploader
          v-model="fileList2"
          :after-read="afterRead2"
          accept="video/*"
          class="jvideo"
          v-if="judgevideo"
          :before-read="beforeReadvideo"
        >
          <van-cell-group>
            <van-cell center>
              <van-button plain type="info" class="picktrue" >上传视频</van-button>
              </van-cell>
          </van-cell-group>
        </van-uploader>
      </van-popup>
       <!-- 图片视频上传--------------------------- -->

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Issues",
  data() {
    return {
      value: "",
      show: false,
      fileList: [],
      fileList2:[], 
      filedata: [],     //图片
      filevideo:[],     //视频
      filefalse:[],     //替换
      http:'',          //图片
      vurl:'',         //视频地址
      url:"../../../assets/imgs/j.png",
      judgevideo:true,
      judgeprlic:true,
    };
  },
  props: {
    type: String,
  },
  methods: {

    //卡死图片
    beforeRead (file) {
      let arr;
      if (!file.length) {
          arr = [file]
      } else {
          arr = file;
      }
      console.log(arr[0])
      if (arr.length > 6) {
        this.$toast.fail('超出上传数量!')
        return false;
      }

      for (let x = 0; x < arr.length; x++) {
        console.log(arr[x].size );
        if (arr[x].size > 500 * 1024 *100 *100)  {
            this.$toast.fail(arr[x].name + ' 图片超出大小');
            return false;
        }
      }
      return true;
      
    },


    //卡死视频
    beforeReadvideo (file) {
      let arr;
      if (!file.length) {
          arr = [file]
      } else {
          arr = file;
      }
      console.log(arr[0])
      if (arr[0].size > 500 * 1024 *100 *100 *50) {
        this.$toast.fail('超出支持的大小')
        return false;
      }
      return true;

    },
   
    //返回
    onClickLeft() {   
      this.$router.push({
        path: "/",
      });
    },
    onClickRight() {
      
      let value = this.value,imgs = this.filedata, video = this.filevideo;
      
      this.$axios
        .post({
          url: "/friends/issues",
          data: { 
            conter: value,
            imgs,
            video
        }
        }).then(
          res => {
            this.show = false;
             if (res && res.code && res.code == -21) {
                this.Toast.fail('请完善个人信息');
                return;
            }

            if (res && res.code && res.code == 1) {
                this.Toast.success('发布成功');
    
                this.$router.push({
                  path:"/"
                })
            } else {
                this.Toast.fail('发布失败');
            }
          }
        ) 

     
    },
    showPopup() {    //显示
      this.show = true;
    },
    afterRead(file) {    //上传图片
      // 此时可以自行将文件上传至服务器
      file.status = "uploading";
      file.message = "上传中...";
      this.judgevideo = false;
      this.judgeprlic = true;
     
      const formData = new FormData();
      if (file.length >= 0) {
        for (let x = 0; x < file.length; x++) {
          formData.append("file[]", file[x].file);
        }
      } else {
        formData.append("file[]", file.file);
      }
      // formData.append('file[]', file.file);
      // return;

      this.filefalse = this.fileList; //显示
      this.fileList = []; //换值

      this.$axios
        .post({
          url: "/friends/ictures",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log("上传成功")
          this.show = false;
          if (res && res.code && res.code == 1) {
            file.status = "done";
            file.message = "上传成功";
            this.filedata = [];
            for (let x = 0; x < res.data.length; x++) {
              this.filedata.push(res.data[x]);
              // this.http = 'http://localhost:3000/imgs/temporary' + "/" + res.data[x]
            }
            // console.log(this.http);
          } else {
            this.filefalse = [];
            this.filedata = [];
            this.$toast.fail("当前图片超出大小");
            file.status = "failed";
          }
        });
    },

    afterRead2(file) {   //上传视频
     
      file.status = "uploading";
      file.message = "上传中...";
      this.judgeprlic = false;
      this.judgevideo = true;
      this.$refs.refvideo.style.zIndex = 1;

      const formData = new FormData();
      if (file.length >= 0) {
       
        for (let x = 0; x < file.length; x++) {
          formData.append("file[]", file[x].file);
        }
      } else {
        formData.append("file[]", file.file);
      }
      // formData.append('file[]', file.file);
      // return;

      this.fileList2 = []; //换值

      this.$axios
        .post({
          url: "/friends/videos",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res && res.code && res.code == 1) {
            this.show = false;
            file.status = "done";
            file.message = "上传成功";
            this.filevideo = [];
            this.filevideo.push(res.data[0]);
            this.vurl = require('../../../config').baseURL + '/videos/temporary' + "/" + res.data[0]
            
            // console.log(this.http);
            // console.log(this.filedata)
          } else if (res && res.code && res.code == -3)  {
            this.$toast.fail("视频过大")
          }
        });
    }
  },
};
</script>

<style scoped lang="less">
 
 #issues{
   background-color: #f8f9fa;
 }
.content {
  margin: 2vh;
  height:50vh;
  // border: 1px solid rgb(236, 233, 233);
  background-color: white;
}

.tit{
  background-color:transparent;
  border:none;
  color:#1989fa;
  font-size: 1rem;
}

/deep/ .input_content {
  border: transparent 1px solid;
}

/deep/ .transfer{
  width:5rem;
  height:5rem;
  float: left;
  margin-left: 5px;
  background:url("../../../assets/imgs/j.png") no-repeat;
  background-size: 30%;
  background-position-x: center;
  background-position-y: center;
  background-color: #e9ecef;
  // border: 1px solid red;

}

 /deep/ .fliefalse .van-uploader__upload{
  display: none;
  padding: 0px;
  width: 0px;
  height: 0px;
}

.picktrue {
  width: 100%;
  border-radius: 5rem;
}

.fliefalse {
  float: left;
  margin-left:5px;
}

/deep/ .fliefalse .van-uploader__upload .van-uploader__upload-icon{
  font-size: 0px;
}

.videobox{
  width:80px;
  height:80px;
}

.videobox video{
  position: relative;
  top:-80px;
  left:5px;
  width:100%;
  height:100%;
  object-fit: fill;
  z-index: -1;
}

/deep/ .jvideo {
  width: 100%;
  margin: 1vh auto;
}

/deep/ .jvideo div{
  width: 100%;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
}


/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}

</style>