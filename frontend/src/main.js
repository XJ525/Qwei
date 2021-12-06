import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import {
  Button,
  Icon,
  Dialog,
  Field,
  Cell,
  CellGroup,
  Toast,
  Uploader,
  Col,
  Row,
  List,
  Tabbar,
  TabbarItem,
  NavBar,
  Calendar,
  Step,
  Steps,
  Popup,
  Swipe,
  SwipeItem,
  Lazyload,
  Sticky,
  Checkbox,
  CheckboxGroup,
  ActionSheet,
  PullRefresh,//下拉刷新
  image,     //图片
  Grid,
  GridItem,
  Form,
  DatetimePicker,
  Tab,
  Tabs,
  Loading,
  IndexBar, 
  IndexAnchor,
  Image as VanImage,
  Divider,
  NoticeBar,
  RadioGroup, 
  Radio,
  ImagePreview,
  Picker,
  overlay,
  Collapse, 
  CollapseItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  dialog,
  SwipeCell,
  Search,
} from 'vant';
import 'vant/lib/index.less';


import Axios from './untils/http'
Vue.prototype.$axios = Axios;
Vue.prototype.Dialog = Dialog;
Vue.prototype.Toast = Toast;
Vue.prototype.Dialog = Dialog;



Vue.use(Button);
Vue.use(Icon);
Vue.use(NavBar);    //导航
Vue.use(Form);
Vue.use(Field);
Vue.use(Cell);
Vue.use(CellGroup)
Vue.use(Popup);
Vue.use(Uploader);
Vue.use(Col);
Vue.use(Row);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Calendar);
Vue.use(Step);
Vue.use(Steps);
Vue.use(ActionSheet);
Vue.use(DatetimePicker);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(SwipeCell);
Vue.use(Search);



// import AMap from 'vue-amap';       //无线加载
Vue.use(PullRefresh); //无线加载
Vue.use(image);
Vue.use(Grid);
Vue.use(GridItem);
// Vue.use(ImagePreview);
Vue.use(Form);
Vue.use(Picker);




// AMap.initAMapApiLoader({
//   // 高德key
//   key: 'd2de3b8aae1f6005cabc3872c6fc1fd1',
//   // 插件集合 （插件按需引入）
//   plugin: ['AMap.Geolocation']
//  });
Vue.use(Loading);
Vue.use(List);
Vue.use(IndexBar);
Vue.use(IndexAnchor);

//  Vue.use(AMap);
// Vue.prototype.AMap = AMap;
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(GoodsAction);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon);

Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Sticky);
Vue.use(Picker);

Vue.use(ActionSheet);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(VanImage);
Vue.use(Divider);
Vue.use(NoticeBar);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(overlay);
Vue.use(dialog);


Vue.config.productionTip = false
// Vue.config.

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
