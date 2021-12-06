<template>
  <div class="clockbox">

    <van-nav-bar title="团队考勤"
                 left-text="返回"
                 left-arrow
                 right-text="导出Excel"
                 @click-left="$router.go(-1)"
                 @click-right="showDate = true" />
    <van-tabs type="card"
              swipeable
              color="#1989fa"
              v-model="active"
              @click="switchs">
      <van-tab title="当日">
        <v-chart ref="myChart"
                 :data="chartData"
                 :extend="chartExtend"
                 :events="chartEvents"
                 height="80vh" />
      </van-tab>
      <van-tab title="当月">
        <v-chart ref="myChart"
                 :data="chartDataMount"
                 :extend="chartExtend1"
                 :events="chartEvents"
                 height="80vh" />
      </van-tab>
    </van-tabs>

    <van-calendar v-model="showDate"
                  type="range"
                  allow-same-day
                  :max-range="30"
                  color="#1989fa"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="onConfirm" />

  </div>
</template>



<script>

import VCharts from 'v-charts'
import VePie from 'v-charts/lib/pie'

export default {
  components: {
    'v-chart': VePie,
  },
  data: function () {
    return {
      startT: '',
      endT: '',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      showDate: false,
      active: 0,
      da: [],
      chartData: {
      },
      chartExtend: {
        legend: {
          bottom: '5%',
          left: 'center',
          formatter: (name) => {
            let data = this.chartData.rows
            let target
            let total = 0
            let _name
            let p = 0
            data.forEach(el => {
              total += el.value
              if (name === el.name) {
                target = el.value
                if (name.length > 5) {
                  _name = name.slice(0, 5) + '...';
                } else {
                  _name = name
                }
              }
            })
            if (total > 0) {
              p = (target / total * 100).toFixed(2)
            }
            let arr = ['{a|' + target + '(' + p + '%)' + '}', '{b|' + _name + '}'];
            return arr.join('\n')
          },
          textStyle: {
            rich: {
              a: {
                width: '10',
                fontSize: 16,
                color: '#333',
                padding: 2,
                fontWeight: 'bold'
              },
              b: {
                width: '10',
                fontSize: 14,
                color: '#333'
              }
            }
          }
        },

        series: {
          // 圆环大小
          radius: ['30%', '60%'],
          // 圆环位置
          center: ['50%', '35%'],
          label: {
            show: false
          },
          color: ['#00b5fc', '#FFC0CB', '#ffce51', '#ff7778',]
        }

      },
      chartEvents: {
        // 点击图例
        legendselectchanged: (item) => {
          this.show = true;
          console.log(88889);
          let myChart = this.$refs.myChart.echarts
          // 点击图例去掉图表项
          myChart._api.dispatchAction({
            type: 'legendSelect',
            name: item.name
          })
          // 点击图例显示有数据的图表项的悬浮数据
          let index = this.chartData.rows.findIndex(data => item.name === data.name)
          console.log(index);
          if (index > -1) {
            if (this.chartData.rows[index].value > 0) {
              setTimeout(() => {
                myChart.dispatchAction({
                  type: 'showTip',
                  dataIndex: index, // 当前点击图例对应图表的哪一项
                  seriesIndex: 0 // 必填
                });
              })
            }
          }
        },
        click: (e) => {


        }
      },
      chartDataMount: {
      },
      chartExtend1: {
        legend: {
          bottom: '5%',
          left: 'center',
          formatter: (name) => {
            let data = this.chartDataMount.rows
            let target
            let total = 0
            let _name
            let p = 0
            data.forEach(el => {
              total += el.value
              if (name === el.name) {
                target = el.value
                if (name.length > 5) {
                  _name = name.slice(0, 5) + '...';
                } else {
                  _name = name
                }
              }
            })
            if (total > 0) {
              p = (target / total * 100).toFixed(2)
            }
            let arr = ['{a|' + target + '(' + p + '%)' + '}', '{b|' + _name + '}'];
            return arr.join('\n')
          },
          textStyle: {
            rich: {
              a: {
                width: '10',
                fontSize: 16,
                color: '#333',
                padding: 2,
                fontWeight: 'bold'
              },
              b: {
                width: '10',
                fontSize: 14,
                color: '#333'
              }
            }
          }
        },

        series: {
          // 圆环大小
          radius: ['30%', '60%'],
          // 圆环位置
          center: ['50%', '35%'],
          label: {
            show: false
          },
          color: ['#00b5fc', '#FFC0CB', '#ffce51', '#ff7778',]
        }

      }


    }
  },
  computed: {


  },
  methods: {

    /**
 * stime 开始时间 etime 结束时间
 */
    compareTime (stime, etime, thisDate) {

      // 转换时间格式，并转换为时间戳
      function tranDate (time) {
        return new Date(time.replace(/-/g, '/')).getTime();
      }
      thisDate = new Date(thisDate);
      // 开始时间
      let startTime = tranDate(stime);
      // 结束时间
      let endTime = tranDate(etime);
      // let thisDate = new Date();
      // 获取当前时间，格式为 2018-9-10 20:08
      let currentTime = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + thisDate.getHours() + ':' + thisDate.getMinutes();
      let nowTime = tranDate(currentTime);
      // 如果当前时间处于时间段内，返回true，否则返回false
      if (nowTime < startTime || nowTime > endTime) {
        return false;
      }
      return true;
    },
    switchs (name, title) {
      if (title == '当日') {
        if (!this.chartData.rows) {
          this.getDay()
        }
      }
      if (!this.chartDataMount.rows) {
        this.getMonthData()
      }
      console.log(this.chartDataMount);
    },
    getDay () {
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
        url: '/check/othercheck',
        params: {
          starT: new Date(`${year}-${month}-${day} 0:0:0`).getTime(),
          endT: new Date(`${year}-${month}-${day + 1} 0:0:0`).getTime() - 1

        }
      }).then(res => {
        let late = 0;
        let leaveEarly = 0
        let ok = 0;
        let duty = 0
        console.log(res);
        for (let i in res) {
          let starStr = '';
          let endStr = '';
          let eStr = '';
          if (res[i][Object.keys(res[i])[0]].code != -2 && res[i][Object.keys(res[i])[0]].code != 2) {
            console.log(i,starStr = res[i][Object.keys(res[i])[0]].message[0]);
            starStr = res[i][Object.keys(res[i])[0]].message[0].substr(0, 10) + ' 8:30';
            endStr = res[i][Object.keys(res[i])[0]].message[0].substr(0, 10) + ' 17:30'
            eStr = res[i][Object.keys(res[i])[0]].message[0].substr(0, 10)

          }

          let arr = res[i][Object.keys(res[i])[0]].message;
          if (res[i][Object.keys(res[i])[0]].code == '-2') {
            this.dutyArr =
              duty++
          } else if (this.compareTime(starStr, endStr, arr[0])) {
            late++; //迟到
          } else if (this.compareTime(eStr, endStr, arr[arr.length - 1])) {
            leaveEarly++;
          } else {
            ok++;
          }


        }

        let data = [
          { value: ok, name: '正常' },

          { value: leaveEarly, name: '早退' },
          { value: late, name: '迟到' },
          { value: duty, name: '缺勤' },
        ]

        let obj = {
          columns: ['name', 'value'],
          rows: data
        }
        this.chartData = obj;
        this.Toast.clear();

      }
      )
    },
    getMonthData () {
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
        url: '/Check/team',
        params: {
          starT: new Date(`${year}-${month}-${1} 0:0:0`).getTime(),
          endT: new Date(`${year}-${month}-${day + 1} 0:0:0`).getTime() - 1

        }
      }).then(res => {
        if (res && res.data) {
          let obj = {
            columns: ['name', 'value'],
            rows: res.data
          }
          this.chartDataMount = obj;

        }








        this.Toast.clear();

      }
      )
    },
    onConfirm (date) {

      const [start, end] = date;
      this.startT = new Date(`${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} 0:0:0`).getTime();
      this.endT = new Date(`${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate() + 1} 0:0:0`).getTime() - 1;
      this.showDate = false;
      this.$axios.get({
        url: '/check/selectdedepart',
        params: {
          starT: this.startT,
          endT: this.endT
        }
      }).then(res => {
        if (res && res.code == '0') {
          console.log(res.data.path);
          const tempLink = document.createElement('a');// 创建a标签，用于跳转至下载链接
          tempLink.style.display = 'none';
          tempLink.href = `${require('../../config').baseURL}/file/table/${res.data.path}`;
          tempLink.setAttribute('download', decodeURI(res.data.path));// 兼容：某些浏览器不支持HTML5的download属性
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
          }
          tempLink.click();
          this.Toast.success('导出成功');

        } else if (res && res.code == '-2') {
          this.Toast.fail('没有考勤数据')
        } else {
          this.Toast.fail('导出失败')
        }

      })




    },



  },
  mounted () {
    this.getDay();
  }
}
</script>

<style lang="less" scoped>
.clockbox {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .bar {
    width: 100vw;
    height: 30vh;
  }
}
/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>