export default {
    path: '/notice',
    name: 'Notice',
    component: () => import(/* webpackChunkName: "Notice" */ '../../views/notice/Notice.vue'),
   
  }