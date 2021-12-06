export default {
  path: '/clock/exportExcel',
  name: 'ExportExcel',
  component: () => import(/* webpackChunkName: "exportExcel" */ '../../views/clock/exportExcel.vue'),
 
}