<template>
  <div class="show">
    <Nav></Nav>

    <div class="ftion">
      <Ftion></Ftion>
    </div>

    <div class="dyname">
      <Dyname></Dyname>
    </div>

  </div>
</template>

<script>

import Nav from '../../components/nav/Nav.vue';
import Ftion from './ftion/Ftion.vue';
import Dyname from './dyname/Dyname.vue';
export default {
  name: 'Show',
  components: {
    Nav,
    Ftion,
    Dyname
  },
  mounted() {
     this.$axios
      .get({
        url: "/role/select",
      })
      .then((res) => {
        if(!res) return 
        this.$store.state.permissions = res
        
        let obj = {};
        for (let i = 0; i < res.length; i++) {
          let key = 'parent_id' + res[i].parent_id;
          if (obj[key]) {
            obj[key].push({
              pid: res[i].pid,
              icon: res[i].icon,
              order_number: res[i].order_number,
              rurl: res[i].rurl,
              pname: res[i].pname
            })
          } else {
            obj[key] = [{
              pid: res[i].pid,
              icon: res[i].icon,
              order_number: res[i].order_number,
              rurl: res[i].rurl,
              pname: res[i].pname
            }]

          }


        }
        this.$store.state.common = obj['parent_id-1'] ? obj['parent_id-1'] : [];
        this.$store.state.blogList = obj['parent_id0'] ? obj['parent_id0'] : [];
        this.common = obj['parent_id-1'] ? obj['parent_id-1'] : [];
        this.blogList = obj['parent_id0'] ? obj['parent_id0'] : [];
      });

    
  },


}
</script>

<style scoped lang="less">
.dyname {
  width: 100vw;
  margin: 2vh 0vh 7vh 0vh;
}
</style>
