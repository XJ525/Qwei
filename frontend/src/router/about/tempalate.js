
export default {
    path: '/about/list/:id',
    name: 'TemPlate',
    component: () => import( /* webpackChunkName: "TemPlate" */ '../../views/about/TemPlate.vue')
}

