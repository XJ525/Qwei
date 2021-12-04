
export default {
  path: '/clock',
  name: 'Clock',
  component: () => import(/* webpackChunkName: "Clock" */ '../../views/clock/clock.vue'),
 
}