
// import Desc from './history'
// import History from './desc'
export default {
    path: '/about',
    name: 'About',
    component: () => import( /* webpackChunkName: "About" */ '../../views/about/About.vue'), //路由懒加载
    // children:[
    //     Desc,
    //     History
    // ]
}