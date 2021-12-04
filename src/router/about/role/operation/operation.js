 
export default {
    path: '/about/role/alter/:id',
    name: 'Operation',
    component: () => import( /* webpackChunkName: "Operation" */ '../../../../views/about/role/operation/AlterRole.vue')
}