
//myshow的子组件
export default {
    path: "/myshow/feedback",
    name: "FeedBack",
    component: () => import( /* webpackChunkName: "FeedBack" */ '../../views/myshow/FeedBack.vue') //路由懒加载
}