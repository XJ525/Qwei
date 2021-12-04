<template>
  <div class="netdisk">
    <div class="head">
      <van-nav-bar title="选择您要移动到的目录"
                   left-text="返回"
                   right-text="确定"
                   left-arrow
                   @click-left="$router.push('/netdisk')"
                   @click-right="determine"
                   >
        <template #right>
        </template>
      </van-nav-bar>
    </div>

    <div class="path">
      <p>
        <span v-bind:class="{ 'isbackon': isBackon }"
              class="backon"
              @click="backOn">返回上一层：</span><span class="pathnow"> {{ path }} </span>
      </p>
    </div>

    <div class="main"
         >
      <div class="files"
           v-for="(item, index) in dir"
           :key="-index - 1">
        <p class="file"
           @click="getInto(item)">
          <img src="../../assets/img/文件.png"
               alt="" />
        </p>
        <p class="fileName"
           @click="getInto(item)">
          {{ item }}
        </p>
        <p class="fileMenu"
           @click="setDir">
          <span class="menu">···</span>
        </p>
      </div>
    </div>
<!-- 
    <div class="fileNull"
         >
      {{ message }}
    </div> -->

    <van-button round
                type="info"
                class="createFile"
                @click="createFile"> <span :style="{ color: '#fff' }"> + </span> </van-button>

    <!-- 新建目录popup弹出层 -->
    <van-popup v-model="show"
               round
               position="bottom"
               :style="{ height: '20%' }">
      <p :style="{ textAlign: 'center', fontSize: '1.2rem' }">新建</p>

      <div class="myNewFile"
           @click="createDir">
        <div class="newlyBuild">
          <van-icon name="card"
                    class="ico" />
          <p>文件夹</p>
        </div>
      </div>

    </van-popup>

    <!-- 新建目录 -->
    <van-popup v-model="createDirShow"
               closeable
               close-icon-position="top-left"
               position="bottom"
               :style="{ height: '100%', backgroundColor: '#454545' }">
      <div class="myNewFiles">
        <div class="newlyBuilds">
          <p>新建文件夹</p>
        </div>
      </div>

      <div class="inputDirName">
        <p class="inputDirNameImage">
          <img src="../../assets/img/文件.png"
               alt="" />
        </p>
        <p class="input">
          <van-cell-group>
            <van-field placeholder="输入文件夹名称"
                       v-model="dirName"
                       input-align="conter"
                       :style="{ borderRadius: '1rem' }" />
          </van-cell-group>
        </p>
        <p class="btnConfirm">
          <van-button plain
                      hairline
                      type="info"
                      @click="confirmCreateFile">确认</van-button>
        </p>
      </div>
    </van-popup>

    <!-- 删除目录 -->
    <van-popup v-model="rmDirShow"
               position="bottom"
               round
               >
      <p class="setFileName"> {{ setDirArr[0] }} </p>
      <p class="rmDirs">重命名</p>
      <p class="rmDirs"
         @click="delDir">删除</p>
    </van-popup>


  </div>
</template>


<script>
export default {
  name: "Netdisk",
  data () {
    return {
      path: "/",
      dir: [],
      download: [],
      setDirArr: [],    //待操作的目录
      backonStr: 0,
      code: "0",
      message: "",
      dirName: "",
      userId: "",
      filemovepath: '',     //文件要移动到的目录
      show: false,      //点击加号显示
      createDirShow: false, //点击文件显示
      rmDirShow: false, //点击···显示
      isBackon: false,  //‘全部文件’的样式
      fontWeight: true, 
      oldfilepath: ''   //要copy的目录
    };
  },
  mounted () {
    this.oldfilepath = localStorage.getItem('oldfilepath');
    localStorage.removeItem('oldfilepath')
    this.rander();
  },

  methods: {
    //页面加载成功渲染
    rander () {
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 10000
      });
      this.$axios
        .post({
          url: "netdisk/readfile",
          data: {
            pathnow: this.path,
          },
        })
        .then((res) => {
          this.Toast.clear();

          if (res && res.code == 0) {
            this.download = res.file.sort();
            this.dir = res.dir.sort();
            this.userId = res.userId
          } else {
            this.code = res.code;
            this.message = res.message;
          }
        });
    },

    //进入目录
    getInto (dirName) {
    
        this.filemovepath = (this.path == '/')? this.path + dirName : this.path + '/' + dirName
      this.backonStr++
      if (this.backonStr >= 0) {
        this.isBackon = true;
        // this.isBackon = 0;
      }
      let filePath = "";
      if (this.path == "/") {
        filePath =
          this.path + event.currentTarget.parentNode.children[1].textContent;
      } else {
        filePath =
          this.path +
          "/" +
          event.currentTarget.parentNode.children[1].textContent;
      }
      filePath = filePath.replace(/\s*/g, "");
      this.$axios
        .post({
          url: "netdisk/readfile",
          data: {
            pathnow: filePath,
          },
        })
        .then((res) => {
          if (res.code == 0) {
            this.download = res.file.sort();
            this.dir = res.dir.sort();
            this.path = filePath;
          } else {
            this.download = [];
            this.dir = [];
            this.path = filePath;
            this.code = res.code;
            this.message = res.message;
          }
          // this.download.push('aa')
        });
    },

    //返回上一层目录
    backOn () {
        if (this.filemovepath == '') return;
        this.filemovepath = this.filemovepath.substr(0, this.filemovepath.lastIndexOf('/'))
        if (this.filemovepath == '') {
            this.filemovepath = '/';
        }
      this.backonStr--
      if (this.backonStr <= 0) {
        this.isBackon = false;
      }
      let filePath = "";
      if (this.path == "/") {
        console.log("已达最上层目录");
        return;
      } else {
        filePath = this.path.substr(0, this.path.lastIndexOf("/"));
        if (filePath == "") filePath = "/";

        this.$axios
          .post({
            url: "netdisk/readfile",
            data: {
              pathnow: filePath,
            },
          })
          .then((res) => {
            if (res.code == 0) {
              this.download = res.file.sort();
              this.dir = res.dir.sort();
              this.path = filePath;
              this.code = res.code;
            } else {
              this.path = filePath;
              this.code = res.code;
              this.message = res.message;
            }
          });
      }
    },
    createFile () {
      this.show = true;
    },
    createDir () {
      this.show = false;
      this.createDirShow = true;
    },

    //确认创建文件
    confirmCreateFile () {
      let dirname = this.dirName;
      dirname = dirname.match(/^[\u4E00-\u9FA5A-Za-z0-9]+/);
      if (dirname == null) {
        this.Toast.fail('文件命名不正确')
        return;
      }

      for (let x = 0; x < this.dir.length; x++) {
        if (this.dir[x] == dirname) {
          this.Toast.fail('文件名重复');
        }
      }

      this.$axios
        .post({
          url: "netdisk/createdir",
          data: {
            dirname: dirname,
            pathnow: this.path,
          },
        })
        .then((res) => {
          if (res.code == 0) {
            this.dir.unshift(dirname[0]);
            this.Toast.success("创建成功");
            this.createDirShow = false;
            this.rander();
            this.code = res.code;
          } else {
            this.code = res.code;
            this.createDirShow = false;
          }
        });
      this.dirName = "";
    },

    setDir () {
      let eventNow = event.currentTarget.parentNode.children[1].textContent;
      this.setDirArr = [eventNow];
      this.rmDirShow = true;
    },

    //删除目录
    delDir () {
      this.Dialog.confirm({
        title: "删除此文件夹",
        message: "文件的历史版本将一并删除，确认是否将文件删除？",
      })
        .then(() => {
          // on confirm
          let delFilename = this.setDirArr[0];
          let delPath = this.path + "/" + delFilename;
          delPath = delPath.replace(/\s*/g, "");
          this.$axios
            .post({
              url: "netdisk/delfile",
              data: {
                pathnow: delPath,
              },
            })
            .then((res) => {
              if (res.code == 0) {
                this.rmDirShow = false;
                this.rander();
              } else {
                console.log(res.message);
              }
            });
        })
    },

    determine () {
        localStorage.setItem('filemovepath', JSON.stringify({
            oldfilepath: this.oldfilepath,
            newfilepath: this.filemovepath
            }))
        this.$router.push('/netdisk')
    }
    //文件重命名


  },
};
</script>

<style scoped lang="less">
@white: white;
@toast-text-color: @white;

.widthAndHeigth {
  height: auto;
  overflow: hidden;
}

* {
  padding: 0;
  margin: 0;
}

body {
  background-color: #efefef;
}

.file {
  flex: 2;
  text-align: center;
  padding-top: 0.6rem;
}

.fileName {
  line-height: 3.5rem;
  flex: 6;
}

.fileMenu {
  // width: 20%;
  flex: 2;
  font-size: 1.5rem;
  text-align: center;
  color: #999;
  .menu {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 3.5rem;
  }
}

img {
  width: 50%;
}

.netdisk {
  .head {
    position: relative;
    width: 100%;
    line-height: 3.5rem;
    text-align: center;
    .back {
      position: fixed;
      left: 0;
      top: 0;
      padding: 0 0.2rem 0 0.2rem;
      font-size: 2rem;
      height: 3.5rem;
      color: #fff;
      // border: 1px solid #fff;
    }
    .span {
      color: #fff;
      font-size: 1.2rem;
    }
  }

  .path {
    width: 100%;
    height: 3.9rem;
    border: 1px solid #f8f9fa;
    background-color: #f8f9fa;
    p {
      margin: 1.5rem;
      font-size: 0.9rem;
      color: #000;
      a {
        display: block;
        width: 30%;
        height: 1.6rem;
        line-height: 1.6rem;
        text-align: center;
        border-radius: 20px;
        background-color: rgb(114, 121, 187);
        color: #efefef;
      }
    }
  }

  .main {
    margin: 0 auto;
    width: 90%;
  }

  .fileNull {
    margin: 3rem auto;
    width: 80%;
    text-align: center;
    color: #787887;
  }

  .download {
    display: flex;
    margin-top: 0.3rem;
    flex-wrap: nowrap;
    font-weight: bold;
    border-radius: 10px;
    border: 1px solid #ddd;
    background-color: #f8f9fa;
    overflow: hidden;
  }

  .widthAndHeigth();
}

.files {
  display: flex;
  margin-top: 0.3rem;
  flex-wrap: nowrap;
  font-weight: bold;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  overflow: hidden;
}

.createFile {
  position: fixed;
  right: 1rem;
  bottom: 10rem;
  width: 3rem;
  height: 3rem;
  border-radius: 45px;
  color: #fff;
  background-color: rgba(37, 99, 192);
  font-size: 1.3rem;
}

.myNewFile {
  width: 20%;
  float: left;
  .newlyBuild {
    float: left;
    margin: 0.3rem;
    margin-top: 1rem;
    width: 100%;
    text-align: center;
  }

  .ico {
    font-size: 2.5rem;
  }

  .widthAndHeigth();
}

.newlyBuilds {
  width: 100%;
  p {
    margin: 0.8rem auto;
    width: 60%;
    color: #fff;
    font-size: 1.1rem;
    text-align: center;
  }
}

.rmDirs {
  padding: 0.8rem;
  //   width: 100%;
  font-size: 1.1rem;
  border-bottom: 1px dotted rgb(174, 174, 255);
  border-top: 1px dotted rgb(174, 174, 255);
  text-align: center;
  color: #000;
}

.setFileName {
  margin: 0.5rem 0;
  padding: 0.2rem 0;
  padding-left: 1rem;
  text-align: center;
  font-weight: bold;
  // width: 100%;
  font-size: 1rem;
  color: #000;
}

.backon {
  font-size: 1.1rem;
  font-weight: bold;
}

.isbackon {
  color: #888;
}

/***********新建目录**************/
.inputDirName {
  width: 100%;

  img {
    width: 100%;
  }

  .inputDirNameImage {
    margin: 0 auto;
    width: 40%;
  }

  .input {
    margin: 1.5rem auto;
    width: 80%;
    border-radius: 10px;
    overflow: hidden;
  }

  .btnConfirm {
    margin: 0 auto;
    width: 40%;
    button {
      width: 100%;
    }
  }
}

/deep/ .van-icon-arrow-left {
    color:#000;
    font-size:1rem;
}
</style>