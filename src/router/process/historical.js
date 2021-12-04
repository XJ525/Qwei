export default {
  path: '/process/historical',
  name: 'Historical',
  component: () => import(/* webpackChunkName: "Historical" */ '../../views/process/historical.vue'),
 
}