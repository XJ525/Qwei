import Vue from 'vue'
import VueRouter from 'vue-router'
import Show from './show'
import Login from './login'
import About from './about'
import Myshow from './myshow'
import Clock from './clock'
import Face from './clock/face'
import Facematch from './clock/facematch'
import Stat from './clock/stat'
import Msg from './myshow/msg'
import UpPsd from './myshow/uppsd'
import MyApp from './about/tempalate'
import Faces from './myshow/faces'
import UserOperation from './about/useroperation'
import Issues from './show/dyname/issues'
import Management from './management/management'
import Altermanagement from './management/altermanagement'
import Process from './process'
import Historical from './process/historical'
import Clockteam from './clock/clockteam'
import ExportExcel from './clock/exportExcel'
import Netdisk from './netdisk'
import Netdiskmove from './netdisk/netdiskmove'
import Message from './message'
import Messagedetinfo from './message/messagedetinfo'
import Messagehistory from './message/messagehistory'
import Maillist from './maillist';
import UserAction from './about/useraction'
import SeeMaillist from './maillist/seemaillist'
import Messagesend from './message/messagesend'
import Choicecontacts from './message/choicecontacts'
import Departmentadmin from './management'

import Notice from './notice'
import Noticesend from './notice/noticesend'


import Role from './about/role/role'
import AddRole from './about/role/operation/addrole'
// import AlterRole from './about/role/operation/alterrole'
// import DelRole from './about/role/operation/delrole'
import Allapproval from './process/allapproval'
import Detailsapproval from './process/detailsapproval'

import Operation from './about/role/operation/operation'
import PowerRouter from './about/power/power'
import AddPower from './about/power/add'
import AlterPower from './about/power/alter'
import FeedBack from './myshow/feedback'
import User from './about/user/index'
import AddUsers from './about/user/add'
import AlterUser from './about/user/alter'
import DelUser from './about/user/del'
import Workdiary from './workdiary'
import Workhistory from './workdiary/workhistory'
import Workapproval from './workdiary/Workapproval'
import Workdetails from './workdiary/Workdetails'
import Myworkapproval from './workdiary/myworkdetails'
import Myhistorical from './process/myhistorical'

import Workmessage from './workmessage'
import Workmessagesee from './workmessage/workmessagesee'
import Workmessagesend from './workmessage/Workmessagesend'
import Workmsgceco from './workmessage/workmsgceco'


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  Login, //登录
  Show, //家
  Myshow, //个人中心
  About, //工作
  Clock,  //打卡
  Face,   //人脸识别
  Facematch, //人脸对比
  Stat, //考勤统计
  Msg,     //我的信息页面
  UpPsd,   //修改信息
  MyApp,    //app内容页
  Faces,    //人脸采集
  UserOperation,   //模板多选
  Issues, //朋友圈发布
  Management, //创建部门
  Altermanagement, //修改部门
  Process, //请假流程
  Historical, //请假历史记录
  Clockteam, //团队考勤
  ExportExcel, //导出Excel
  Netdisk,  //网盘
  Netdiskmove, //网盘文件的拷贝
  Message, //站内信息
  Messagedetinfo, //站内信息详情
  Maillist, //通讯录
  UserAction,      //真模板
  Role,             //角色权限
  AddRole,            //添加角色
  Allapproval,      //所有审批过的的假期
  Detailsapproval,  //审批假期
  Operation,           //
  PowerRouter,          //权限管理
  AddPower,            //添加权限
  AlterPower,           //修改权限
  FeedBack,            //反馈
  User,              //用户
  AddUsers,           //添加用户
  AlterUser,         //修改用户
  DelUser,           //删除用户
  Messagesend,  //站内信发布
  Choicecontacts,  //发布站内信选择联系人
  Messagehistory,  //我的站内信发送历史
  SeeMaillist,  //通讯录用户详情
  Notice,       //查看公告
  Noticesend,   //发布公告
  Departmentadmin,      //部门管理
  Notice,             //公告
  Departmentadmin,     //部门管理
  Workdiary,            //提交工作日志
  Workhistory,           //历史工作日志
  Workapproval,         //审核日志
  Workdetails,          //日志详情
  Myworkapproval,        //我的历史日志
  Notice,       //查看公告
  Noticesend,   //发布公告
  Myhistorical, //我的历史请假
  Workmessage,       //工作通知
  Workmessagesee,     //查看工作通知
  Workmessagesend,    //发送工作通知
  Workmsgceco,        //发送通知联系人列表
  {
    path:"*",
    redirect:"/"
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
