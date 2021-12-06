
export default {
    path:"/myshow",
    name:"Myshow",
    component: () => import( /* webpackChunkName: "Myshow" */ '../../views/myshow/Myshow.vue'),

}