export default {
    path: "/message/messagesend",
    name: "Messagesend",
    component: () => import(/* webpackChunkName: "Messagesend" */ '../../views/message/Messagesend.vue')
}
