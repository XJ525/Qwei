<template>
  <div class="netdisk">
    <div class="head">
      <van-nav-bar
        title="我的云盘"
        left-text="返回"
        left-arrow
        fixed
        class="mytitle"
        @click-left="$router.push('/about')"
      >
        <template #right> </template>
      </van-nav-bar>
    </div>

    <div class="path">
      <p>
        <span
          v-bind:class="{ isbackon: isBackon }"
          class="backon"
          @click="backOn"
          >文件位置：</span
        ><span class="pathnow"> {{ path }} </span>
      </p>
    </div>

    <div class="main" >
      <div class="files" v-for="(item, index) in dir" :key="-index - 1">
        <p class="file" @click="getInto">
          <img src="../../assets/img/文件.png" alt="" />
        </p>
        <p class="fileName" @click="getInto">
          {{ item }}
        </p>
        <p class="fileMenu" @click="setDir(dir, index)">
          <span class="menu">···</span>
        </p>
      </div>
      <div class="download" v-for="(item, index) in download" :key="index">
        <p class="file" @click="downloadFile(item)">
          <img src="../../assets/img/资料.png" alt="" />
          <!-- <a href="http://localhost:3000/pan/8/新建 文本文档.txt" @click="aclick"  download ='http://localhost:3000/pan/8/新建 文本文档.txt'  ref="downloadBtn"> -->
          <!-- aaaaaaa
          </a> -->
          <!-- <a @click="downloadFile('http://localhost:8080/pan/8','aa.txt')">下载文件</a> -->
        </p>
        <p class="fileName" @click="downloadFile(item)">
          {{ item }}
        </p>
        <p class="fileMenu" @click="setDir(download, index)">
          <span class="menu">···</span>
        </p>
      </div>
    </div>

    


    <van-button
      icon="plus"
      type="primary"
      :round="true"
      class="createFile"
      @click="createFile"
    ></van-button>

    <!-- 新建目录popup弹出层 -->
    <van-popup
      v-model="show"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <p :style="{ textAlign: 'center', fontSize: '1.2rem',padding: '1rem' }">请选择</p>

      <div class="myNewFile" @click="createDir">
        <div class="newlyBuild">
          <van-icon name="card" class="ico dirico" />
          <p>文件夹</p>
        </div>
      </div>

      <div class="myNewFile" @click="trigger">
        <div class="newlyBuild">
          <van-icon name="column" class="ico fileico" />
          <p>上传文件</p>
        </div>

        <input
          type="file"
          ref="fileBtn"
          id="uploadFile"
          multiple="multiple"
          :style="{ display: 'none' }"
        />
      </div>
    </van-popup>

    <!-- 新建目录 -->
    <van-popup
      v-model="createDirShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      class="newfile"
      
    >
      <div class="myNewFiles">
        <div class="newlyBuilds">
          <p>新建文件夹</p>
        </div>
      </div>

      <div class="inputDirName">
        <p class="inputDirNameImage">
          <img src="../../assets/img/文件.png" alt="" />
        </p>
        <p class="input">
          <van-cell-group>
            <van-field
              placeholder="输入文件夹名称"
              v-model="dirName"
              input-align="center"
              class="projectname"
            />
          </van-cell-group>
        </p>
        <p class="btnConfirm">
          <van-button class="confirmbtn" v-if="dirName != ''" hairline type="info" @click="confirmCreateFile"
            >确认</van-button
          >
          <van-button class="confirmbtn" v-else hairline type="info" @click="confirmCreateFile" disabled
            >确认</van-button
          >
        </p>
      </div>
    </van-popup>

    <!-- 删除目录 -->
    <van-popup v-model="rmDirShow"
               position="bottom"
               round
               :style="{ height: '26%' }">
      <p class="setFileName"> {{ setDirArr[0] }} </p>
      <p class="rmDirs"
        @click="setFileName(setDirArr[0])"
      >
      重命名</p>
      <p class="rmDirs"
        @click="filemove(setDirArr[0])"
      >
        拷贝</p>
      <p class="rmDirs"
         @click="delDir">删除</p>
    </van-popup>


    <van-popup v-model="showQuery" position="top" :style="{ height: '7%' }">

        <div class="querysClick">
            <van-field
            v-model="newfileName"
            center
            clearable
            placeholder="请输入新的文件名"
            :style="{ height: '100%' }"
            >
            <template #button>
                <van-button plain type="info" class="btn" @click="setFileNamecuss">
                  &nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;
                  </van-button>
            </template>
            </van-field>
        </div>
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
      show: false,  //点击加号显示
      createDirShow: false,   //点击文件显示
      rmDirShow: false,   //点击···显示
      isBackon: false,  //‘全部文件’的样式
      fontWeight: true,
      newfileName: '',     //新文件名
      oldfilename: '',     //原文件名
      showQuery: false, //点击重命名
      setFielArr: [],     //点···要操作的数组
      index: 0,           //点···要操作的数组的索引

    };
  },
  mounted () {
    let filemovepath = localStorage.getItem('filemovepath')
  if (filemovepath != null) {
    let pathObj = JSON.parse(filemovepath)
    this.filecopy(pathObj)
    localStorage.removeItem('filemovepath')
  } 
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
    getInto () {
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
          url: "/netdisk/readfile",
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
      this.backonStr--
      if (this.backonStr <= 0) {
        this.isBackon = false;
        // this.isBackon = 0;
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
            url: "/netdisk/readfile",
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
      if (dirname[0] != dirname['input']) {
        this.Toast.fail('文件名不正确')
        return;
      }

      for (let x = 0; x < this.dir.length; x++) {
        if (this.dir[x] == dirname) {
          this.Toast.fail('文件名重复');
        }
      }

      this.$axios
        .post({
          url: "/netdisk/createdir",
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

    setDir(fileArr, index) {
      this.setFielArr = fileArr;
      this.index = index;
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
              url: "/netdisk/delfile",
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

    //上传文件
    trigger () {
      this.$refs.fileBtn.dispatchEvent(new MouseEvent("click"));
      let _this = this;
      event.currentTarget.children[1].onchange = function () {
     
        let fromDom = new FormData();
        let pathnow = _this.path;
        for (let x = 0; x < this.files.length; x++) {
          fromDom.append("file", this.files[x]);
        }
        fromDom.append("path", pathnow)
        _this.$axios
          .post({
            url: "/netdisk/getupfile",
            // url: '/friends/ictures',
            data: fromDom,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res && res.code == 0) {
              _this.rander();
              _this.show = false;
            }
          });
      };
    },



    //下载文件
    downloadFile (fileName) {
      fileName = this.userId + this.path + '/' + fileName
      const tempLink = document.createElement('a');// 创建a标签，用于跳转至下载链接
      tempLink.style.display = 'none';
      tempLink.href = `${require('../../config').baseURL}/file/pan/${fileName}`;
      tempLink.setAttribute('download', decodeURI(fileName));// 兼容：某些浏览器不支持HTML5的download属性
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }
      tempLink.click();
      this.Toast.success('开始下载');

    },

    //文件重命名
    setFileName (fileName) {
      this.rmDirShow = false;
      this.showQuery = true;
      this.oldfilename = fileName.trim();
      this.newfileName = fileName.trim();

    },

    setFileNamecuss () {
      let dirname = this.newfileName;
      if (dirname == '') {
        this.Toast.fail('文件名为空')
        return;
      }
      dirname = dirname.match(/^[\u4E00-\u9FA5A-Za-z0-9_]+\.?[\u4E00-\u9FA5A-Za-z0-9_]+$/);
      if (dirname == null) {
        this.Toast.fail('文件名不正确')
        return;
      } else {
        dirname = dirname[0]
      }
      let oldName = (this.path == '/') ? this.path + this.oldfilename : this.path + '/' + this.oldfilename;
      let newName = (this.path == '/') ? this.path + this.newfileName : this.path + '/' + this.newfileName;

      this.$axios.post({
        url: '/netdisk/setfilename',
        data: {
          newName,
          oldName
        }
      }).then (
        res => {
          if (res.code == 0) {
            this.Toast.success('成功修改')
            if (this.setFielArr == this.dir) {
              this.dir[this.index] = dirname
            } else {
              this.download[this.index] = dirname
            }
          } else {
            this.Toast.fail(res.message)
          }
            this.showQuery = false;

        }
      )

    },


    //文件的移动
    filemove (fileName) {
      this.path = this.path.trim();
      fileName = fileName.trim();
      let oldfilepath = (this.path == '/') ? this.path + fileName : this.path + '/' + fileName
      localStorage.setItem('oldfilepath', oldfilepath)
      this.$router.push('./netdisk/netdiskmove')
    },

    filecopy ({ oldfilepath, newfilepath }) {
      
      this.$axios.post({
        url: 'netdisk/copyfile',
        data: {
          oldfilepath: oldfilepath,
          newfilepath: newfilepath
        }
      }).then (
        res => {
          if (res.code == 0) {
            this.Toast.success('文件复制成功')
            this.rander();
          }
        }
      )
    }

  },
};
</script>


<style scoped lang="less">
@white: white;
@toast-text-color: @white;
.mytitle {
  height: 7vh;
}

.newfile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(.1, .3, .2, .1);
}


.widthAndHeigth {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.pathnow {
  font-size: 1.1rem;
  font-weight: bold;
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
  color: #dee2e6;
  .menu {
    display: block;
    width: 100%;
    height: 100%;
    color: #dee2e6;
    text-align: center;
    line-height: 3.5rem;
  }
}

img {
  width: 50%;
}

.netdisk {
  padding-top: 16vh;
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
    .netdisk {
      height: 7vh;
      line-height: 7vh;
    }
  }

  .path {
    width: 100%;
    height: 7vh;
    position: fixed;
    left: 0;
    top: 7vh;
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
  font-size: 1rem;
  width: 3rem;
  height: 3rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  top: 78vh;
  border-radius: 10rem;
  background-color: cornflowerblue;
  border: none;
  z-index: 999;
}

.myNewFile {
  width: 20%;
  float: left;
  .newlyBuild {
    // float: left;
    margin: 0.3rem;
    margin-top: 1rem;
    width: 100%;
    text-align: center;

    p {
      color: black;
    }
  }

  .ico {
    font-size: 2.5rem;
  }

  .dirico {
    color: #e2d7ba;
  }

  .fileico {
    color: #aecbeb;
  }

  .widthAndHeigth();
}

.newlyBuilds {
  width: 100%;
  padding-top: 1vh;
  p {
    margin: 0.8rem auto;
    width: 60%;
    color: #fff;
    font-size: 1.1rem;
    text-align: center;
  }
}

.projectname {
  border-radius: 4rem;
  height: 5vh;
  line-height: 5vh;
  font-size: 1rem;
}

.rmDirs {
  padding-top: 1.8rem;
  padding-bottom: 0rem;
  //   width: 100%;
  font-size: 1.1rem;
  // border-bottom: 1px dotted rgb(174, 174, 255);
  // border-top: 1px dotted rgb(174, 174, 255);
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
  padding-top: 20vh;
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
    width: 50%;
    .confirmbtn {
      width: 100%;
      border-radius: 0.5rem;
      font-size: 1rem;
    }
  }
}

.querysClick {
    margin: 2% auto;
    width: 80%;
    height: 70%;
    border: 1px solid #999;
    border-radius: 1.5rem;
    overflow: hidden;
    /deep/ .van-field__control {
      padding-left: 1rem;
    }
    .btn {
        border: none;
        border-left: 1px solid #999;
        span {
            color: #777;

        }
    }
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>