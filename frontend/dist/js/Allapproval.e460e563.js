(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Allapproval"],{"86b0":function(t,e,a){"use strict";a("8d2e")},"8d2e":function(t,e,a){},e4e5:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"allapproval"},[a("div",{staticClass:"head"},[a("van-nav-bar",{staticClass:"leave",attrs:{fixed:"",title:"假事审核","left-text":"返回","left-arrow":""},on:{"click-left":t.backOn}})],1),a("div",[a("van-pull-refresh",{staticClass:"content",on:{refresh:t.onRefresh},model:{value:t.refreshing,callback:function(e){t.refreshing=e},expression:"refreshing"}},[a("van-list",{attrs:{finished:t.finished,"finished-text":"没有啦"},on:{load:t.onLoad},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},t._l(t.msgArr,(function(e){return a("div",{key:e["leave_id"],staticClass:"conters",on:{click:function(a){return t.lookMessage(e)}}},[a("div",{staticClass:"img"},[a("i",[a("img",{attrs:{src:e["user_head_url"],alt:"","v-lazy":e["user_head_url"]}})])]),a("div",{staticClass:"conter"},[a("div",{staticClass:"conterLeft"},[a("p",{staticClass:"partConters"},[a("span",{style:{color:"#00ff00"}},[t._v("·")]),t._v(" "+t._s(e.username)+" ")]),a("p",{staticClass:"partConter"},[a("span",{style:{color:"#00ff00"}},[t._v("·")]),t._v(" "+t._s(e.apply_type)+" ")]),a("p",{staticClass:"partConter"},[a("span",{style:{color:"#00ff00"}},[t._v("·")]),t._v(" "+t._s(e["apply_time"])+" ")])]),a("div",{staticClass:"conterRight"},[0==e["audit_state"]?a("div",[a("div",{staticClass:"child"})]):a("div",[a("div",{staticClass:"read"})])])])])})),0)],1)],1)])},i=[],r={name:"Allapproval",data(){return{loading:!1,finished:!1,refreshing:!1,msgArr:[],onceArr:[],page:"",imgs:a("f89e")}},mounted(){this.page=this.page||1},methods:{timestampToTime(t){let e=new Date(t),a=e.getFullYear()+"-",s=(e.getMonth()+1<10?"0"+(e.getMonth()+1):e.getMonth()+1)+"-",i=(e.getDate()+1<10?"0"+e.getDate():e.getDate())+" ",r=(e.getHours()+1<10?"0"+e.getHours():e.getHours())+":",n=e.getMinutes()+1<10?"0"+e.getMinutes():e.getMinutes();return a+s+i+r+n},lookMessage(t){localStorage.setItem("data",JSON.stringify(t)),this.$router.push({path:"/detailsapproval"})},onLoad(){this.$axios.get({url:"/leave/pendingapproval",params:{page:this.page}}).then(t=>{if(console.log(t),this.refreshing&&(this.msgArr=[],this.refreshing=!1),t&&t.data)for(let e=0;e<t.data.length;e++)t.data[e]["apply_time"]=this.timestampToTime(t.data[e]["apply_time"]),null==t.data[e]["user_head_url"]||""==t.data[e]["user_head_url"]?t.data[e]["user_head_url"]=this.imgs:t.data[e]["user_head_url"]=a("f121").baseURL+"/imgs/temporary/"+t.data[e]["user_head_url"],this.msgArr.push(t.data[e]),this.msgArr=this.msgArr.reverse();this.loading=!1,this.page+=1,this.page>t.pagetotle?this.finished=!0:t.pagetotle||(this.finished=!0)})},onRefresh(){this.finished=!1,this.page=1,this.onLoad(),this.loading=!0},backOn(){this.$router.push("/about")}}},n=r,l=(a("86b0"),a("2877")),o=Object(l["a"])(n,s,i,!1,null,"69533703",null);e["default"]=o.exports},f89e:function(t,e,a){t.exports=a.p+"img/moren.5c56d74a.png"}}]);
//# sourceMappingURL=Allapproval.e460e563.js.map