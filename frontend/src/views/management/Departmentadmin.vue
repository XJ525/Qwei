<template>
    <div class="departmentadmin">
        <van-nav-bar    title="部门管理"
                        left-text="返回"
                        right-text="新建部门"
                        fixed
                        class="newdepartment"
                        left-arrow
                        @click-left="onClickLeft"
                        @click-right="onClickRight"
                        />

        <div v-for="(item, index) in data" :key="index" class="btn-box">
             <van-button type="info" class="button" @click="Management(item.name, item.head_id, item.department_id)">{{ item.name }}</van-button>
        </div>
    </div>

   
</template>

<script>

export default {
    name:"Departmentadmin",
    
    data() {
        return{
            data:[],
        }
    },

    mounted() {
        this.$axios.get({
          url:"/department/select",
      }).then(
          ress => {
            for(let x = 0; x < ress.length;x++) {
              this.data.push(ress[x]);
            } 
          }
      );

    },

    methods: {
      
        onClickLeft() {
            this.$router.push({
                path:"/about"
            })
        },

        onClickRight() {
            this.$router.push({
                path:"/management"
            })
        },

        Management(name, uid, departmentid) {
            // console.log(name, uid)
            this.$router.push({
                name:"Altermanagement",
                params:{
                    name,
                    uid,
                    departmentid
                }
            })
        }

    }

}

</script>

<style lang="less" scoped>
.departmentadmin {
    padding-top: 7vh;
    min-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
}

.newdepartment {
    height: 7vh;
}

   .btn-box{
        width:60%;
        height: 10vh;
        margin:1vh auto;

        .button{
            width: 100%;
            height: 8vh;
        }
   }



/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>