(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Workmessage"],{"0274":function(e,t,s){},2579:function(e,t,s){"use strict";s("0274")},7596:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"workmsg"},[s("div",{staticClass:"head"},[1==e.flag?s("van-nav-bar",{attrs:{title:"工作通知","left-text":"返回","left-arrow":"","right-text":"发布通知"},on:{"click-left":function(t){return e.$router.replace("/about")},"click-right":function(t){return e.$router.push("/workmessage/workmessagesend")}}}):s("van-nav-bar",{attrs:{title:"工作通知","left-text":"返回","left-arrow":""},on:{"click-left":function(t){return e.$router.replace("/")}}})],1),e.workmessageAll.length>0?s("div",{staticClass:"workmsgmain"},[s("div",{staticClass:"mainNoticeAll"},[s("van-list",{attrs:{finished:e.finished,"finished-text":"到底啦"},on:{load:e.onLoad},model:{value:e.loading,callback:function(t){e.loading=t},expression:"loading"}},e._l(e.workmessageAll,(function(t,a){return s("div",{key:a,staticClass:"oldNotice",on:{click:function(s){return e.lookMessage(t["message_id"])}}},[s("van-cell-group",{attrs:{inset:""}},[s("van-cell",{attrs:{title:""+t["username"],label:""+t["content"]}},[s("span",{staticClass:"tineRelease"},[e._v(" "+e._s(t["message_time"])+" ")])])],1)],1)})),0)],1)]):e._e()])},i=[],l={name:"Workmessage",data(){return{workmessageAll:[],finished:!0,listTotal:"",loading:!1,flag:!1}},mounted(){this.rander(),this.$axios.get({url:"/role/select"}).then(e=>{for(let t=0;t<e.length;t++)37==e[t].pid&&(this.flag=!0)})},methods:{rander(){this.Toast.loading({message:"",forbidClick:!0,duration:1e4}),this.$axios.get({url:"workmessage/workrecemsg"}).then(e=>{if(0==e.code){for(let t=0;t<e.data.length;t++)e.data[t]["message_time"]=this.timestampToTime(e.data[t]["message_time"]);this.listTotal=e.listTotle,this.workmessageAll=e.data.reverse()}else console.log(e.message);this.workmessageAll.length<this.listTotal&&(this.finished=!1),this.Toast.clear()})},timestampToTime(e){let t=new Date(e),s=t.getFullYear()+"-",a=(t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"-",i=t.getDate()+1<10?"0"+t.getDate():t.getDate();return s+a+i},onLoad(){this.$axios.post({url:"",data:{page:this.workmessageAll.length}}).then(e=>{if(e&&0==e.code){this.loading=!1;for(let t=0;t<e.data.length;t++)this.msgArr.push(e.data[t])}else this.msgArr.length>=this.listTotal&&(this.finished=!0)})},lookMessage(e){this.$router.push("/workmessage/workmessagesee?msgid="+e)}}},o=l,n=(s("2579"),s("2877")),r=Object(n["a"])(o,a,i,!1,null,"228cb59f",null);t["default"]=r.exports}}]);
//# sourceMappingURL=Workmessage.d73122ab.js.map