
export default {
    path: '/about/user/alter/:id',
    name: 'AlterUser',
    component: () => import( /* webpackChunkName: "AlterUser" */ '../../../views/about/user/AlterUser.vue')
}