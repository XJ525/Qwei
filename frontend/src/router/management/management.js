
export default {
    path: "/management",
    name: "Management",
    component: () => import( /* webpackChunkName: "Management" */ '../../views/management/Management.vue'),
    //懒加载
}