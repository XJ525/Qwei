
<template>
  <div id="dyname">
    <!-- 无线加载-------------------------->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-row>
          <van-col
            span="24"
            class="each"
            v-for="(item, itemval) in list"
            :key="itemval"
          >
            <!-- 用户信息 -->
            <van-col span="24" style="height: 10vh; text-align: center">
              <van-col span="5">
                <van-image
                  round
                  width="2.8rem"
                  height="2.8rem"
                  :src=" item.user_head_url ? 
                    require('../../../config').baseURL +
                    '/imgs/temporary/' +
                    item.user_head_url : require('../../../assets/img/员工.png')
                  "
                  class="logo"
                />
              </van-col>

              <van-col span="19" class="name">
                <van-col span="24" class="name_user">{{
                  item.nickname ? item.nickname : item.username
                }}</van-col>
                <van-col span="20" class="name_time">{{ item.time }}</van-col>
              </van-col>
            </van-col>
            <!-- 用户信息 -->

            <!-- 朋友圈内容 -->
            <van-col
              span="24"
              style="height: auto; color: black; padding-left: 5px"
            >
              <!--根据是否有文章内容来显示 -->
              <van-col span="24" v-show="item.content">
                <van-col span="4" />
                <van-col span="20">
                  <div class="username" ref="userdiv" @click="user_con_all">
                    {{ item.content }}
                  </div>
                </van-col>
              </van-col>

              <!-- 是否有图片 -->
              <van-col
                span="24"
                style="height: auto"
                v-show="
                  item.attac_picture_id.length != 0 ||
                  item.attac_video_id.length != 0
                "
              >
                <van-col span="4" />
                <!-- 显示图片 -->
                <van-col span="18">
                  <van-col
                    span="8"
                    v-for="(once, index) in item.attac_picture_id"
                    :key="index"
                    v-show="item.attac_picture_id.length != 0"
                    style="height: 15vh"
                  >
                    <van-col span="24">
                      <van-image
                        width="100%"
                        height="15vh"
                        :src="require('../../../config').baseURL +'/imgs/temporary/' + once"
                        class="logo2"
                        @click="showplic(item.attac_picture_id,index)"
                      />
                    </van-col>
                  </van-col>
                </van-col>
              </van-col>

              <!-- 视频 -->
              <van-col
                span="24"
                style="height: auto"
                v-show="item.attac_video_id.length != 0"
              >
                <van-col span="4" />

                <van-col span="18">
                  <van-col
                    span="24"
                    v-for="(once, index) in item.attac_video_id"
                    :key="index"
                    v-show="item.attac_video_id.length != 0"
                  >
                    <!-- <van-image width="5rem"
                               height="5rem"
                               :src="once"
                               
                               @click="showplic(item.attac_picture_id)" /> -->
                    <div class="video">
                      <div class="video-icon">
                        <van-icon
                          class="play-icon playic"
                          name="play-circle-o"
                          size="5rem"
                          @click="playVideo('video_' + index)"
                        />
                      </div>
                      <video
                        :ref="'video_' + index"
                        class="
                          my-player
                          video-js
                          vjs-default-skin vjs-big-play-centered
                        "
                        preload="auto"
                      >
                        <source :src="require('../../../config').baseURL + '/videos/temporary/' + once" type="video/mp4" />
                      </video>
                    </div>
                  </van-col>
                </van-col>
              </van-col>

              <!-- 点赞或评论内容 -->
              <van-col span="24" style="height: auto" class="shquality">
                <van-col span="4"></van-col>
                <van-col span="18" style="height: auto">
                  <van-nav-bar>
                    <!-- 评论图标--开始---------->
                    <template #left>
                      <van-icon
                        name="chat-o"
                        size="1.2rem"
                        class="comment"
                        @click="showqualitys(item.article_id, itemval)"
                      />
                    </template>
                    <!-- 评论--结束---------->

                    <!-- 点赞 图标开始------------------->
                    <template #right>
                      <van-icon
                        :name="Like[itemval]"
                        size="1.2rem"
                        @click="
                          clicklike(item.article_id, item.nickname, itemval)
                        "
                      />
                    </template>
                    <!-- 点赞  图标结束--------------------->

                    <template #title v-if="item.nameuid == item.user_id">
                      <van-icon
                        name="delete-o"
                        size="1.2rem"
                        ref="deletebox"
                        @click="clickdele($event, item.article_id)"
                      />

                    </template>
                  </van-nav-bar>

                  <!-- 点赞人-  显示----  开始-------------->
                  <van-col
                    span="24"
                    style="height: auto; border: 1px solid #caf0f8"
                    v-show="item.like[0]"
                  >
                    <van-grid direction="horizontal" >
                      <van-grid-item
                        v-for="(like, index3) in item.like"
                        :key="index3"
                        ref="likes"
                        :text="like"
                        class="likeuser"
                      ></van-grid-item>
                    </van-grid>
                  </van-col>
                  <!-- 点赞人--显示---结束------------->
                  <!-- v-if="
                      item['article_quality'][0].quality != '' ||
                      item['article_quality'][0].userid != ''
                    " -->

                  <!-- 评论显示  开始 -->
                  <div
                    v-for="(artiquality, index4) in item.article_quality"
                    :key="index4"
                  >
                    <van-col
                      span="24"
                      class="newqulit"
                      v-if="
                        item['article_quality'][0].quality != '' ||
                        item['article_quality'][0].userid != ''
                      "
                    >
                      <div
                        class="com_box"
                        ref="commit_content"
                        @click="commit_open"
                      >
                        <span class="vancolconter"
                          >{{ artiquality.userid }}：</span
                        >
                        <span class="commit">{{ artiquality.quality }}</span>
                      </div>
                    </van-col>
                  </div>
                  <!-- <van-col
                    span="24"
                    class="newqulit"
                    v-for="(artiquality, index4) in item.article_quality"
                    :key="index4"
                  > -->

                  <!-- <van-col span="24"> -->

                  <!-- 评论显示  结束 -->

                  <!-- 发布评论内容------------->
                  <van-popup
                    v-model="show"
                    position="bottom"
                    :style="{ height: '40%' }"
                  >
                    <div class="Leaving_message">
                      <van-field
                        v-model="message"
                        rows="5"
                        autosize
                        class="qualityipt"
                        label=""
                        type="textarea"
                        spellcheck="false"
                        maxlength="200"
                        placeholder="请输入评论内容......"
                        show-word-limit
                      />
                    </div>
                    <!-- 发布评论内容------------->
                    <van-button
                      v-if="message != ''"
                      type="info"
                      class="release_button"
                      @click="commentqualitys(quality, qualitykey)"
                      >评论</van-button
                    >
                    <van-button
                      v-else
                      type="info"
                      class="release_button"
                      disabled
                      >评论</van-button
                    >
                  </van-popup>
                </van-col>
              </van-col>
            </van-col>
          </van-col>
        </van-row>
      </van-list>
    </van-pull-refresh>
    <!-- 无线加载------------------------->

    <van-button
      icon="plus"
      type="primary"
      :round="true"
      class="issues"
      @click="issues"
    ></van-button>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  name: "Dyname",

  data() {
    return {
      count: [],
      page: false,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      immediatecheck: false,
      message: "",
      show: false, //评论框
      time: 1000,
      quality: "",
      qualitykey: "",
      Chat: [],
      Like: [],
    };
  },

  props: {
    round: String,
  },

  mounted() {
    if (!this.page) this.page = 1;
    // this.onLoad();
  },

  methods: {

    //删除
    clickdele(e,article) {
      console.log(article)
      let pare =  e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      this.showdelete = true;

      this.$dialog.confirm({
         title: "确定删除",
        
      }).then(()=> {


              this.$axios.post({
                url:'/friends/deletes',
                data:{
                  article
                }
              }).then(
                res => {


                  if (res && res.code == 8) {
                      pare.remove();
                      this.$toast.success("删除成功")
                  } else {
                      this.$toast.fail("删除失败")
                  }
                }
              )
              
      }).catch(() => {
              
      })
    },

    issues () {
      this.$router.push({
        path: "/vissues",
      });
    },
    //标题添加点击展开文本
    user_con_all() {
      this.$refs.userdiv.forEach((item, key) => {
        if (item == event.target) {
          this.$refs.userdiv[key].style.webkitLineClamp = "100";
        }
      });
    },
    //点击评论展开
    commit_open() {
      this.$refs.commit_content.forEach((item, key) => {
        if (this.$refs.commit_content[key].children[1] == event.target) {
          this.$refs.commit_content[key].style.webkitLineClamp = "20";
        }
      });
    },

    onLoad() {
      //页面数据
      setTimeout(() => {
        this.$axios
          .get({
            url: "/friends/render",
            params: {
              page: this.page,
            },
          })
          .then((res) => {
            
            if (res && res.code == -308) {
                this.list = [];
                this.finished = true;
                return;
            }          
            if (this.refreshing) {
              this.list = [];
              this.refreshing = false;
            }
            if(!res.data) return;
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].attac_video_id = JSON.parse(
                res.data[i].attac_video_id
              );
              res.data[i].attac_picture_id = JSON.parse(
                res.data[i].attac_picture_id
              );

              if (
                !res.data[i].article_quality ||
                res.data[i].article_quality[0].quality == "" ||
                res.data[i].article_quality[0].userid == ""
              ) {
                res.data[i].article_quality = [{ quality: "", userid: "" }];
              } else {
                res.data[i].article_quality = JSON.parse(
                  res.data[i].article_quality
                );
              }

              //点赞状态
              if (!res.data[i].like) {
                res.data[i].like = "";
              }
              let likeuser = res.data[i].like.split(",");
              res.data[i].like = likeuser.reverse();
              if (likeuser.indexOf(res.data[i].name) >= 0) {
                this.Like.push("like");
              } else {
                this.Like.push("like-o");
              }
              //时间
              let times = res.data[i].time;
              let newtime = new Date(times);
              res.data[i].time = `${
                Number(newtime.getMonth()) + 1
              }-${newtime.getDate()} ${newtime.getHours()}:${newtime.getMinutes()}`;
              //渲染数据
              this.list.push(res.data[i]);
             
            }

            //翻页到顶没有了
            this.loading = false;
            this.page += 1;
            if (this.page > res.pageCount) {
              this.finished = true;
            }
          });
      }, this.time);
    },

    onRefresh() {
      // 清空列表数据
      this.finished = false;

      //刷新页数
      this.page = 1;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },

    //点赞操作
    clicklike(id, name, key) {
      this.$axios
        .post({
          url: "/friends/goodlikes",
          data: {
            conterid: id,
          },
        })
        .then((res) => {
          if (res && res.code == -20) {
              this.$toast.fail("您的昵称为空，请完善个人信息");
              return;
          }
          let likes = this.$data.list[key].like;
          if (res && res.code == 6) {
            //添加人员
            if (likes[0] == '') {
                likes.shift();
            }
            likes.unshift(res.username);
            this.Like[key] = "like";
           
          }
          if (res && res.code == -6) {
            //删除人员
            likes.shift();
            this.Like[key] = "like-o";
          }
        });
    },
    //显示评论
    showqualitys(id, key) {
      this.qualitykey = key;
      this.quality = id;
      this.show = true;
    },

    //发送评论
    commentqualitys(id, key) {
      this.$axios
        .post({
          url: "/friends/qualitys",
          data: {
            arti: id,
            conter: this.message,
          },
        })
        .then((res) => {
          
          if (res && res.code == -20) {
              this.$toast.fail("您的昵称为空，请完善个人信息");
              return;
          }
          let qualitys = this.$data.list[key].article_quality;
          if (res && res.code == 7) {
            this.$toast.success('评论成功');
            this.show = false;
            this.message = "";

            //添加数据

            if (qualitys[0].quality == "" || qualitys[0].userid == "") {
              qualitys.shift();
              qualitys.push({
                quality: res.conter.userconter,
                userid: res.conter.username,
              });
            } else {
              qualitys.push({
                quality: res.conter.userconter,
                userid: res.conter.username,
              });
            }
          }
          if (res && res.code == -7) {
            this.$toast.fail(res.message);
          }
        });
    },

    showplic(arr, index) {
      if(arr) {
        arr.forEach((item,key) => {
          arr[key] = require('../../../config').baseURL +'/imgs/temporary/' + item;
        })
      }
      ImagePreview({
        images: arr,
        startPosition: index,
      });
    },
    playVideo(id) {
      this.$refs[id][0].webkitRequestFullScreen();
      this.$refs[id][0].play();

      // console.log(player);
      //     this.$refs[id][0].on('ended', function() {
      //       console.log(111);
      // });

    },

  },
};
</script>
<style scoped lang="less">
@width: 100%;
@height: 30vh;
@height2: auto;

#dyname {
  width:100vw;
  min-height: 60vh;
  overflow: hidden;
  // height: @height2;
  // border: 1px solid rgb(54, 52, 52);
  color: darkgrey;
  // margin: 0px auto;
}

.issues {
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

/deep/ .logo {
  margin: calc((10vh - 2.8rem) / 2) 0;
}



.name .van-col {
  height: 5vh;
  // border: 1px solid red;
  line-height: 5vh;
  text-align: left;
  padding-left: .3125rem;
  font-size: 18px;
}

.name .name_user {
  color: #0096c7;
  font-size: 1.2rem;
  line-height: 2.8rem;
  font-weight: bold;
}
.name .name_time {
  font-size: 0.8rem;
}

.newqulit {
  height: auto;
  // overflow: hidden;
  // padding: 1rem;
  padding: 0.3rem 0 0.3rem 0;
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 0.9rem;
  background-color: #edf2f4;
}


.com_box {
  //添加文本溢出
  white-space: normal; //强制换行
  word-break: break-all; //连续英文字符不换行解决办法

  display: -webkit-box; //文本溢出
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  // overflow: hidden;
  // text-overflow:ellipsis;
  // white-space: nowrap;
}

/deep/ .each {
  padding-top: 3vh;
}

.username {
  // background-color: #0096c7;
  width: 90%;
  // height: 10vh;
  color: #495057;
  text-align: left;
  white-space: normal; //强制换行
  word-break: break-all; //连续英文字符不换行解决办法
  margin-bottom: 0.4rem;
  font-size: 1rem;

  display: -webkit-box; //文本溢出
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/deep/ .release_button {
  display: block;
  margin: 1rem auto;
  width: 90%;
  border-radius: 4rem;
  font-size: 1rem;
}

/deep/ .likeuser div {
  padding: 0 0;
}

/deep/ .likeuser {
  padding: 0.3rem 0 0.3rem 0;
}

/deep/ .likeuser .van-grid-item__content::after {
  border: none;
  padding: 1rem;
}

.vancolconter {
  // text-align: left;
  // height: auto;
  color: #00b4d8;
  font-size: 0.9rem;
}

/deep/ .shquality .van-overlay {
  background-color: rgba(0, 0, 0, 0);
  z-index: 999;
}

/deep/ .qualityipt .van-field__control {
  border: 1px solid #e9ecef;
  padding: 1vh;
}
.video {
  width: 100%;
  height: 9.375rem;
  position: relative;
  .video-icon {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(75, 55, 55, 0.5);
  }
  .my-player {
    // left: 0;
    width: 100%;
    height: 100%;
    // position: absolute;
  }

  .play-icon {
    top: 25% - 2.5rem;
    left: 35%;
    // z-index: 20;
    opacity: .3; //ico  play 播放图标透明度
    position: absolute;
  }

  .delecenter {
    margin-left:100px ;
    width:2rem;
    height: 2rem;
    border:1px solid red;
  }
}
</style>