export default {
    path: '/about/user',
    name: 'User',
    component: () => import( /* webpackChunkName: "User" */ '../../../views/about/user/User.vue')
}