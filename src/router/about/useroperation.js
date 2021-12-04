export default {
    path: '/about/user/:id',
    name: 'UserOperation',
    component: () => import( /* webpackChunkName: "UserOperation" */ '../../views/about/UserOperation.vue')
}
