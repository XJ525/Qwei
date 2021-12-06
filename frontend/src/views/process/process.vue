<template>
  <div>
    <div>
      <van-nav-bar title="请假申请"
                   left-text="返回"
                   left-arrow
                   right-text="我的申请"
                   @click-left="onClickLeft"
                   @click-right="$router.push('/process/historical')" />
    </div>

    <div>
      <van-cell title="申请类型"
                :is-link="true"
                :required="true"
                :center="true"
                arrow-direction="down"
                :value="selectVal"
                @click="show = true;selectVal = leaveType[1]" />
    </div>

    <van-cell title="选择日期区间"
              :value="Timedate"
              @click="showDate = true" />
    <van-calendar v-model="showDate"
                  type="range"
                  color="#1989fa"
                  allow-same-day
                  @confirm="onConfirm" />

    <van-action-sheet v-model="show"
                      title="请假类型">
      <div class="content">
        <van-picker :columns="leaveType"
                    @change="onChange"
                    :default-index="1"
                    visible-item-count="3" />

      </div>
    </van-action-sheet>

    <div>
      <van-field v-model="message"
                 rows="2"
                 autosize
                 label="申请理由"
                 type="textarea"
                 maxlength="50"
                 placeholder="请输入"
                 show-word-limit />
    </div>

    <div class="box">
      <van-button v-if="selectVal != '请选择' && Timedate != '请选择' && message != ''"
                  class="btn"
                  type="info"
                  @click="submit">提交申请</van-button>
      <van-button v-else
                  class="btn"
                  disabled
                  type="info">提交申请</van-button>
    </div>

  </div>
</template>


<script>
export default {
  name: 'process',

  data () {
    return {
      columns: ['请假', '补卡'],
      show: false,
      selectVal: '请选择',
      leaveType: [], //请假类型
      showDate: false,
      showDate: false,
      Timedate: '请选择',
      startT: '',
      endT: '',
      message: '',
      selectValIndex: '1'
    }
  },
  computed: {



  },
  methods: {
    onClickLeft () {
      this.$router.replace('/')
    },

    onChange (picker, value, index) {
      this.selectVal = value
      this.selectValIndex = index;
    },
    formatDate (date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm (date) {

      const [start, end] = date;
      this.startT = new Date(`${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`).getTime();
      this.endT = new Date(`${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`).getTime();
      this.showDate = false;
      this.Timedate = `${this.formatDate(start)} - ${this.formatDate(end)}`;
    },
    submit () {
      if (this.selectVal == '请选择' || this.Timedate == '请选择' || this.message == '') {
        this.Toast('请选择必填项');
        return;
      }
      this.$axios.post({
        url: '/leave/leave',
        data: {
          atype: this.selectValIndex,
          areason: this.message,
          statTime: this.startT,
          endTime: this.endT
        }
      }).then(res => {
        if (res && res.code == '0') {
          this.Toast.success('提交成功');
          this.selectVal = '请选择';
          this.Timedate = '请选择';
          this.message = '';
         setTimeout(() => {
            this.$router.replace('/process/historical')
           
         }, 1000);
        } else if (res && res.code == '-411') {
          this.Toast.fail('选项不能为空');
        } else if (res && res.code == '-412') {
          this.Toast.fail('理由不能为空');
        }
        else {
          this.Toast.fail('提交失败');
        }
      })


    }



  },
  mounted () {
    this.Toast.loading({
      message: "",
      forbidClick: true,
      duration: 10000
    })
    this.$axios.get({
      url: '/leave/leavetype',
    }).then(res => {
      this.leaveType = res;
      this.Toast.clear();
    })
  }

}
</script>
<style lang="less" scoped>
.content {
  height: 30vh;
}
.box {
  margin: 0 auto;
  width: 95%;

  .pasinput {
    font-size: 1rem;
    padding-top: 1rem;
  }

  .btn {
    width: 100%;
    margin-top: 1rem;
    border-radius: 4rem;
    font-size: 1rem;
  }
}

/deep/ .van-icon-arrow-left {
  color: #000;
  font-size: 1rem;
}
</style>