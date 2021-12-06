export default {
    path: "/message",
    name: "Message",
    component: () => import(/* webpackChunkName: "Message" */ '../../views/message/Message.vue')
}
