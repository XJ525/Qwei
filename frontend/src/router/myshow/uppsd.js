

//myshow的子组件
export default {
    path: "/myshow/uppsd",
    name: "UpPsd",
    component: () => import( /* webpackChunkName: "UpPsd" */ '../../views/myshow/UpPsd.vue') //路由懒加载
}