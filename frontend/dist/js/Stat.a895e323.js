(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Stat"],{"45ac":function(t,e,a){"use strict";a("f64d")},"5ca9":function(t,e,a){"use strict";a("ccf2")},"5f76":function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"nav"},[a("van-tabbar",{attrs:{route:""}},[a("van-tabbar-item",{staticClass:"iconfont icon-dingwei index",attrs:{replace:"",to:"/clock"}},[a("span",[t._v("定位")])]),a("van-tabbar-item",{staticClass:"iconfont icon-renlian work",attrs:{replace:"",to:"/facematch"}},[a("span",[t._v("人脸")])]),a("van-tabbar-item",{staticClass:"iconfont icon-tongji my",attrs:{replace:"",to:"/stat"}},[a("span",[t._v("统计")])])],1)],1)},r=[],l=(a("5ca9"),a("2877")),n={},i=Object(l["a"])(n,s,r,!1,null,"ef51d1e4",null);e["a"]=i.exports},7734:function(t,e,a){"use strict";e["a"]={checkPhone(t){return!!/^1(3|4|5|6|7|8|9)\d{9}$/.test(t)},stampChangehHonurs:function(){let t=(new Date).getHours(),e=(new Date).getMinutes(),a=(new Date).getSeconds();return`${this.add0(t)}:${this.add0(e)}:${this.add0(a)}`},add0(t){return t<10?"0"+t:t},timeChangeDate(t){let e=new Date(t);return`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`}}},"9a5d":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"stat"},[1==t.flag?a("van-nav-bar",{attrs:{title:"考勤统计","left-text":"返回","left-arrow":"","right-text":"团队考勤"},on:{"click-left":t.onClickLeft,"click-right":function(e){return t.$router.push("/clockteam")}}}):a("van-nav-bar",{attrs:{title:"考勤统计","left-text":"返回","left-arrow":""},on:{"click-left":t.onClickLeft}}),a("ClockNav",{attrs:{data:t.active}}),a("van-cell-group",{staticClass:"top",attrs:{inset:""}},[a("van-cell",{attrs:{title:"当月汇总"}}),a("div",{staticClass:"record_list"},[a("van-cell",{staticClass:"record",attrs:{title:t.late,label:"迟到（次）"}}),a("van-cell",{staticClass:"record",attrs:{title:t.leaveEarly,label:"早退（次）"}})],1)],1),a("van-cell-group",{staticClass:"calendar",attrs:{inset:""}},[a("van-calendar",{style:{height:"22.5rem"},attrs:{title:"每日记录",poppable:!1,"show-confirm":!1,"min-date":t.minDate,"max-date":t.maxDate,color:"#1989fa",formatter:t.formatter,"show-title":!1},on:{"month-show":t.getMonths,select:t.selects}})],1),a("van-action-sheet",{attrs:{title:t.day},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[a("div",{staticClass:"content"},t._l(t.arr,(function(e,s){return a("div",{key:s},["请假"==e.substr(0,2)?a("p",[t._v(t._s(e))]):a("p",[t._v(t._s(e.substr(-8)))])])})),0)])],1)},r=[],l=a("5f76"),n=a("7734"),i={data(){return{active:"stat",minDate:new Date(2020,0,1),maxDate:new Date,dstas:{},dutyArr:[],leaveArr:[],lackArr:[],late:0,lateArr:[],leaveEarly:0,leaveEarlyArr:[],steps:0,show:!1,arr:[],day:"",flag:!1}},methods:{formatter(t){let e=t.date.getFullYear();const a=t.date.getMonth()+1,s=t.date.getDate();let r=`${e}-${n["a"].add0(a)}-${n["a"].add0(s)}`;return this.dutyArr.includes(r)&&t.date.getTime()<(new Date).getTime()?t.topInfo="缺勤":this.leaveArr.includes(r)?t.topInfo="请假":this.lateArr.includes(r)?t.topInfo="迟到":this.lackArr.includes(r)&&(t.topInfo="缺卡"),t},onClickLeft(){this.$router.go(-1)},getMonths(t){let e=t.date.getFullYear(),a=t.date.getMonth()+1,s=t.date.getDate(),r=`${e}-${n["a"].add0(a)}-${n["a"].add0(s)}`;this.Toast.loading({message:"",forbidClick:!0,duration:1e4}),this.dutyArr.includes(r)||this.leaveArr.includes(r)||this.$axios.get({url:"/check/mycheck",params:{starT:new Date(`${e}-${a}-1 0:0:0`).getTime(),endT:new Date(`${e}-${a+1}-1 0:0:0`).getTime()-1}}).then(t=>{Object.assign(this.dstas,t);let e=new Date,a=e.getFullYear(),s=e.getMonth()+1,r=e.getDate();for(let l in t)"-2"==t[l].code?l!=`${a}-${s}-${r}`&&this.dutyArr.push(l):"2"==t[l].code?this.leaveArr.push(l):"0"==t[l].code&&t[l].message.length<2&&(console.log(l),this.lackArr.push(l));this.Toast.clear()})},getdata(){let t=new Date,e=t.getFullYear(),a=t.getMonth()+1,s=t.getDate();this.Toast.loading({message:"",forbidClick:!0,duration:1e4}),this.$axios.get({url:"/check/mycheck",params:{starT:new Date(`${e}-${a}-1 0:0:0`).getTime(),endT:new Date(`${e}-${a}-${s+1} 0:0:0`).getTime()-1}}).then(t=>{Object.assign(this.dstas,t);for(let r in t)"-2"==t[r].code?r!=`${e}-${a}-${s}`&&this.dutyArr.push(r):"2"==t[r].code?this.leaveArr.push(r):"0"==t[r].code&&t[r].message.length<2?this.lackArr.push(r):"0"==t[r].code&&t[r].message[0]&&t[r].message[0].substr(-8).substr(0,2)>9&&(this.late++,this.lateArr.push(r),t[r].message[t[r].message.length-1].substr(-8).substr(0,2)<17&&t[r].message[t[r].message.length-1].substr(-8).substr(3,2)>30&&(this.leaveEarly++,this.leaveEarlyArr.push(r)));this.Toast.clear()})},selects(t){let e=t.getFullYear();const a=t.getMonth()+1,s=t.getDate();let r=`${e}-${n["a"].add0(a)}-${n["a"].add0(s)}`,l=`${n["a"].add0(a)}-${n["a"].add0(s)}`;if(this.show=!0,this.day=l,Array.isArray(this.dstas[r].message))this.arr=this.dstas[r].message;else if("-2"==this.dstas[r].code){let t=new Date,e=t.getFullYear(),a=t.getMonth()+1,s=t.getDate();this.arr=r!=`${e}-${a}-${s}`?["缺勤"]:["今天没有打卡记录"]}else"2"==this.dstas[r].code&&(console.log(this.dstas[r].message),this.arr=[`请假${this.dstas[r].message.startTime}至${this.dstas[r].message.endTime}`])}},components:{ClockNav:l["a"]},mounted(){this.getdata(),this.$axios.get({url:"/role/select"}).then(t=>{for(let e=0;e<t.length;e++)21==t[e].pid&&(this.flag=!0)})}},c=i,o=(a("45ac"),a("2877")),d=Object(o["a"])(c,s,r,!1,null,"6fb01dc8",null);e["default"]=d.exports},ccf2:function(t,e,a){},f64d:function(t,e,a){}}]);
//# sourceMappingURL=Stat.a895e323.js.map