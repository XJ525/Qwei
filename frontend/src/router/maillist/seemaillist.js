export default {
    path: "/maillist/seemaillist",
    name: "SeeMaillist",
    component: () => import(/* webpackChunkName: "SeeMaillist" */ '../../views/maillist/SeeMaillist.vue')
}