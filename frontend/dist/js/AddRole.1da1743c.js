(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["AddRole"],{"49d6":function(t,e,s){"use strict";s("6bf0")},5084:function(t,e,s){"use strict";s.r(e);var l=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"btn"},[s("van-nav-bar",{staticClass:"head",attrs:{"left-text":"返回","left-arrow":"",title:"新建角色",fixed:!0},on:{"click-left":t.onClickLeft}}),s("van-cell-group",{attrs:{title:"角色名"}},[s("van-field",{staticClass:"new_role",attrs:{label:"角色名",maxlength:"9",placeholder:"请输入角色名"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1),s("van-checkbox-group",{model:{value:t.result,callback:function(e){t.result=e},expression:"result"}},[s("van-cell-group",{attrs:{title:"选择权限"}},t._l(t.option,(function(e,l){return s("van-cell",{key:e.pid,staticClass:"new_roles",attrs:{clickable:"",title:" "+e.pname},on:{click:function(e){return t.toggle(l)}},scopedSlots:t._u([{key:"right-icon",fn:function(){return[s("van-checkbox",{ref:"checkboxes",refInFor:!0,attrs:{name:e.pid}})]},proxy:!0}],null,!0)})})),1)],1),0!=t.result.length&&""!=t.value?s("van-button",{staticClass:"submit",attrs:{type:"info"},on:{click:t.submits}},[t._v("提交")]):s("van-button",{staticClass:"submit",attrs:{type:"info",disabled:""}},[t._v("提交")])],1)},o=[],a={data(){return{show:"",showtitle:"",result:[],list:[],checked:!0,select:[],option:"",powerid:"",showcontent:!1,showsub:"",radio:"",value:"",columns:[],showPicker:!1,username:"",tel:"",values:"",showPickers:!1,sexvalue:"1",date:"",showtime:!1,list_department_id:{},columns_role_id:{},role_id:"",power_obj:{}}},methods:{onClickLeft(){this.$router.push({path:"/about/role"})},toggle(t){this.$refs.checkboxes[t].toggle()},submits(){this.showtitle="新建角色",this.Toast.loading({message:"创建中...",forbidClick:!0}),this.$axios.post({url:"/role/add",data:{roleName:this.value,roleids:"["+String(this.result)+"]"}}).then(t=>{"0"==t.code?(this.Toast.success("创建成功"),this.$router.push({path:"/about/role"})):this.Toast.fail("创建失败")})}},mounted(){this.showtitle="创建角色",this.$axios.get({url:"/power/select"}).then(t=>{let e=[];t&&Array.isArray(t)&&t.forEach(t=>{(t.parent_id>=0||"-1"==t.pid)&&e.push(t)}),console.log(t),this.option=e,console.log(t)})}},i=a,n=(s("49d6"),s("2877")),r=Object(n["a"])(i,l,o,!1,null,"1ed744a4",null);e["default"]=r.exports},"6bf0":function(t,e,s){}}]);
//# sourceMappingURL=AddRole.1da1743c.js.map