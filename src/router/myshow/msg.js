//myshow的子组件
export default {
    path: "/myshow/msg",
    name: "Msg",
    component: () => import( /* webpackChunkName: "Msg" */ '../../views/myshow/Msg.vue') //路由懒加载
}

