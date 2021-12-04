<template>
  <div class="stat">
    <van-nav-bar v-if="flag == true" title="考勤统计"
                 left-text="返回"
                 left-arrow
                 right-text="团队考勤"
                 @click-left="onClickLeft"
                 @click-right="$router.push('/clockteam')" />
                
    <van-nav-bar v-else title="考勤统计"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft"/>
    <ClockNav :data="active"> </ClockNav>
    <van-cell-group inset
                    class="top">
      <van-cell title="当月汇总" />
      <div class="record_list">
        <van-cell class="record"
                  :title="late"
                  label="迟到（次）" />
        <van-cell class="record"
                  :title="leaveEarly"
                  label="早退（次）" />

      </div>

    </van-cell-group>

    <van-cell-group inset
                    class="calendar">
      <van-calendar title="每日记录"
                    :poppable="false"
                    :show-confirm="false"
                    :style="{ height: '22.5rem' }"
                    :min-date="minDate"
                    :max-date="maxDate"
                    color="#1989fa"
                    :formatter="formatter"
                    :show-title="false"
                    @month-show="getMonths"
                    @select="selects" />
    </van-cell-group>

    <van-action-sheet v-model="show"
                      :title="day">
      <div class="content">
        <div v-for="(item,key) in arr"
             :key="key">
             <p v-if="item.substr(0,2) == '请假'">{{ item }}</p>
          <p v-else>{{item.substr(-8)}}</p>
        </div>

      </div>
    </van-action-sheet>

  </div>
</template>
<script>
import ClockNav from '../../components/nav/ClockNav.vue'
import untils from '../../untils'
export default {
  data () {
    return {
      active: 'stat',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      dstas: {},
      dutyArr: [], //缺勤
      leaveArr: [], //请假
      lackArr: [],    //缺卡
      late: 0,       //迟到
      lateArr: [],
      leaveEarly: 0,    //早退
      leaveEarlyArr: [],
      steps: 0,
      show: false,
      arr: [],
      day: '',   //当天日期
      flag: false,

    }
  },
  methods: {
    formatter (day) {
      let year = day.date.getFullYear();
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      let d = `${year}-${untils.add0(month)}-${untils.add0(date)}`;

      if (this.dutyArr.includes(d) && (day.date.getTime() < new Date().getTime())) {
        day.topInfo = '缺勤';
      } else if (this.leaveArr.includes(d)) {
        day.topInfo = '请假';
      } else if (this.lateArr.includes(d)) {
        day.topInfo = '迟到';
      } else if (this.lackArr.includes(d)) {
        day.topInfo = '缺卡';
      }
      return day;
    },

    onClickLeft () {
      this.$router.go(-1)
    },
    getMonths (d) {
      let year = d.date.getFullYear();
      let month = d.date.getMonth() + 1;
      let date = d.date.getDate();
      let ds = `${year}-${untils.add0(month)}-${untils.add0(date)}`;
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 10000
      });

      if (this.dutyArr.includes(ds)) {
        return
      } else if (this.leaveArr.includes(ds)) {
        return
      }
      this.$axios.get({
        url: '/check/mycheck',
        params: {
          starT: new Date(`${year}-${month}-1 0:0:0`).getTime(),
          endT: new Date(`${year}-${month + 1}-1 0:0:0`).getTime() - 1

        }
      }).then(res => {
        Object.assign(this.dstas, res);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        for (let i in res) {
          if (res[i].code == '-2') {
            if ((i != `${year}-${month}-${day}`)) {
              this.dutyArr.push(i)
            }

          } else if (res[i].code == '2') {
            this.leaveArr.push(i)
          } else if (res[i].code == '0' && res[i].message.length < 2) {
            console.log(i);
            this.lackArr.push(i)

          }
        }
        this.Toast.clear();


      })


    },
    getdata () {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.Toast.loading({
        message: "",
        forbidClick: true,
        duration: 10000
      });
      this.$axios.get({
        url: '/check/mycheck',
        params: {
          starT: new Date(`${year}-${month}-1 0:0:0`).getTime(),
          endT: new Date(`${year}-${month}-${day + 1} 0:0:0`).getTime() - 1

        }
      }).then(res => {

        Object.assign(this.dstas, res)
        for (let i in res) {
          if (res[i].code == '-2') {
            if ((i != `${year}-${month}-${day}`)) {
              this.dutyArr.push(i)
            }
          } else if (res[i].code == '2') {
            this.leaveArr.push(i)
          } else if (res[i].code == '0' && res[i].message.length < 2) {
            this.lackArr.push(i)
          } else if (res[i].code == '0' && res[i].message[0]) {
            if (res[i].message[0].substr(-8).substr(0, 2) > 9) {
              this.late++;
              this.lateArr.push(i)
              if (res[i].message[res[i].message.length - 1].substr(-8).substr(0, 2) < 17 && res[i].message[res[i].message.length - 1].substr(-8).substr(3, 2) > 30) {
                this.leaveEarly++;
                this.leaveEarlyArr.push(i)
              }

            }

          }
        }
        this.Toast.clear();



      })
    },
    selects (day) {
      let year = day.getFullYear();
      const month = day.getMonth() + 1;
      const date = day.getDate();
      let d = `${year}-${untils.add0(month)}-${untils.add0(date)}`;
      let m = `${untils.add0(month)}-${untils.add0(date)}`;
      this.show = true;
      this.day = m;
      if (Array.isArray(this.dstas[d].message)) {
        this.arr = this.dstas[d].message
      } else if (this.dstas[d].code == '-2') {

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if ((d != `${year}-${month}-${day}`)) {
          this.arr = ['缺勤']
        } else {
          this.arr = ['今天没有打卡记录']
        }


      } else if(this.dstas[d].code == '2') {
        console.log(this.dstas[d].message);
        this.arr = [`请假${this.dstas[d].message.startTime}至${this.dstas[d].message.endTime}`]

      }

    }

  },
  components: {
    ClockNav,
  },
  mounted () {
    this.getdata();
    this.$axios.get({
      url: '/role/select',
    }).then(res => {
      for(let x = 0; x < res.length;x++) {
        if(res[x].pid == 21) {
          this.flag = true;

        }
      }
     
    })


}
}
</script>
<style lang="less" scoped>
.stat {
  width: 100vw;
  height: 92vh;
  overflow: auto;
  .top {
    margin-top: 1.875rem;
  }
  .record_list {
    display: flex;
    .record {
      text-align: center;
      width: 50%;
      flex: 1;
      span {
        font-size: 1.25rem;
        font-weight: bold;
        color: red;
      }
    }
  }
  .calendar {
    margin-top: 1.875rem;
  }

  .content {
    text-align: center;
    padding: 50px 30px 50px;
    div {
      p {
        width: 100%;
        margin: 0 auto;
        height: 1.875rem;
        line-height: 1.875rem;
      }
    }
  }
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>