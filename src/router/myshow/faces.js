//myshow的子组件
export default {
    path: "/myshow/faces",
    name: "Faces",
    component: () => import( /* webpackChunkName: "Faces" */ '../../views/myshow/Faces.vue') //路由懒加载
}
