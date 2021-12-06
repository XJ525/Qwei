

export default {
    path: '/about/action/:id',
    name: 'UserAction',
    component: () => import( /* webpackChunkName: "UserAction" */ '../../views/about/UserAction.vue')
}
