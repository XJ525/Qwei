export default {
    path: "/maillist",
    name: "Maillist",
    component: () => import(/* webpackChunkName: "Maillist" */ '../../views/maillist/Maillist.vue')
}