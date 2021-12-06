<template>
  <div>
      <van-nav-bar
      :title="show.title"
      left-text="返回"
      left-arrow
      class="head"
      @click-left="onClickLeft"
      />
    <!-- <h1>{{ $route.params.id}}</h1> -->
    <div class="content">
      <van-cell-group>
          <van-field class="inps" v-for="(item,index) in show.parameter" :key="index" v-model="show.val[index]" :label="item" :placeholder="'请输入' + item" />
      </van-cell-group>
        <van-button class="btns" type="info" @click="commit" v-if="show.btn != '' && blogList[$route.params.id - 1].parameter.length == show.val.length && show.val.length != 0 && show.val.indexOf('') < 0 ">{{ show.btn }}</van-button>
        <van-button class="btns" type="info" @click="commit" v-else-if="show.btn != ''" disabled>{{ show.btn }}</van-button>
        <!-- <router-link target="_blank" :to="{ path: '/demo', query: { id: 78 } }">
          新页面打开demo页
        </router-link>
        <router-link target="_blank" :to="{ name: 'demo', params: { id: 78 } }">
          新页面打开demo页1
        </router-link> -->
        <van-popup round v-model="reveal">
          <div class="con" >
            查询结果：
            {{msg}}
          </div>
        </van-popup>
      </div>
    </div>
   
</template>

<script>

export default {
  data() {
    return {
      blogList: [
        {
          id:"1", title:'新建权限', parameter: ['权限名称', '权限C/A'], val: [],  btn: '创建权限',
        },
        {
          id:"2", title:'查询权限', parameter: ['权限id'], val: [],  btn: '查询',
        },
        {
          id:"3", title:'更新权限', parameter: ['权限ID', '权限名称','权限url', '父级url'], val: [],  btn: '更新权限',
        }
      ],
      show: {id:'',title:'', parameter:[], val: [], btn:''},
      reveal: false,  //弹出层是否展示控制
      msg: ''  //弹出层信息
    }
  },
  // created() {
  //   let id = this.$route.params.id;
    
  // },
  methods: {
    onClickLeft() {
       this.$router.push({
          path:'/about'
       })
    },
    commit() {
      switch(this.show.id) {
        case "1": 
          this.$axios.post({
            url:'/power/add',
            data: {
              pname:this.show.val[0],
              purl: this.show.val[1]
            }
          }).then(
            res => {
              if (res.code == "0") {
                //添加成功
                this.Toast.success('添加成功');
                this.$router.push({
                  path:'/about'
                })
              }
              else if (res.code == "-8") {
                //权限名或c/a已经存在
                this.Toast.fail('权限名或c/a已经存在');
              } else {
                //添加失败
                this.Toast.fail('添加失败');
              }
            }
          )
          break;
        case "2": 
          this.$axios.post({
            url:'/power/find',
            data: {
              pid: this.show.val[0]
            }
          }).then(
            res => {
              //直接调用弹出框显示权限信息
              this.msg = res.pname;
              this.reveal = true;
              console.log(res)
              
            }
          ) 
          break;
        case "3":
          this.$axios.post({
            url:'/power/update',
            data: {
              pid: this.show.val[0],
              pname: this.show.val[1],
              purl: this.show.val[2],
              parentid: this.show.val[3],
            }
          }).then(
            res => {
              if (res.code == '0') {
                //更新成功
                this.Toast.success('更新成功');
                this.$router.push({
                  path:'/about'
                })
              } else {
                //更新失败，请重试
                this.Toast.fail('更新失败，请重试');
              }
            }
          ) 
          break;
        default: console.log(2222222222)
        }
      }
    
  },
  mounted() {
    // console.log(this.$route.params.id);
    // console.log( this.blogList[0])
    switch(this.$route.params.id) {

      case "1": this.show = this.blogList[0]; break;
      case "2": this.show = this.blogList[1]; break;
      case "3": this.show = this.blogList[2]; break;
    }
    
    // this.$axios.post({
    //   url: '/power/find',
    //   data: {
    //     pid: this.pid
    //   }
    // }).then(
    //   res => {
    //     console.log(res)
    //   }
    // )
  }
}
</script>

<style lang="less" scoped>
.head {
  padding: 0.4rem;
}

.content {
  width: 95%;
  margin: 0.2rem auto;
  text-align: center;

  .inps {
   padding-top: 1rem;
   font-size: 1rem;
  }

  .btns {
   width: 90%;
   margin: 2.5rem auto;
   border-radius: 4rem;
   font-size: 1rem;
  }
  .con {
    width: 20rem;
    height: 20vh;
    font-size: 1.6rem;
    line-height: 20vh;
    text-align: center;
  }
}


</style>
