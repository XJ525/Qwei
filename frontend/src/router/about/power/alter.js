export default {
    path: '/about/power/alter/:id/:parentid',
    name: 'AlterPower',
    component: () => import( /* webpackChunkName: "AlterPower" */ '../../../views/about/power/AlterPower.vue')
}