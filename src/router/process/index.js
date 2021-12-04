export default {
  path: '/process',
  name: 'Process',
  component: () => import(/* webpackChunkName: "Process" */ '../../views/process/process.vue'),
 
}