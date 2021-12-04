import axios from 'axios'
const qsLib = require('querystring')

import router from '../router'
import  { Toast } from 'vant';
Toast.setDefaultOptions({ duration: 2000 });
axios.defaults.timeout = 10000;


axios.defaults.baseURL = 'http://localhost:3000/';

axios.interceptors.request.use(
  config => {
    config.timeout = 10000
    let token = localStorage.getItem('token');
    console.log(router);
    // if(!token) {
    //   router.push('/login')
    //   return;
    // }
    console.log(token);
    config.headers['User-Token'] = token;
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)


axios.interceptors.response.use(
  (response) => {
    // console.log(response);

    if (response && response.data && response.data.code == '401') {
      Toast.fail('没有权限');
      setTimeout(() => {
        console.log(response)
        router.push('/')
      }, 1000);
      
    }
    if (response && response.data && response.data.code == '-11') {
      Toast.fail('身份过期，请重新登陆');
      setTimeout(() => {
        router.push({
          path: '/login'
        })
      }, 1000);
      
    }
    if (response && response.data && response.data.code == '-403') {
      Toast.fail('账户被冻结，请联系管理员');
      setTimeout(() => {
        router.push({
          path: '/login'
        })
      }, 1000);
    }
    if (response && response.data && response.data.code == '-500') {
      Toast.fail('账户在别处登陆');
      setTimeout(() => {
        router.push({
          path: '/login'
        })
      }, 1000);
    }
    if (response && response.data && response.data.code == '-399') {
      console.log(111);
      Toast.fail('没有权限');
       setTimeout(() => {
        router.push({
          path: '/'
        })
      }, 1000);
      return;
    }

    if (response && response.data && response.data.code == '-200') {
     
      Toast.fail('账号异常');
      setTimeout(() => {
        router.push({
          path: '/login'
        })
      }, 1000);
      return;
    }
    if (response && response.headers && response.headers['user-token']) {
      localStorage.setItem('token', response.headers['user-token'])
    }
    if (response && response.data) {
      return response.data;
    } else {
      return response
    }


  },
  error => {
    if (error && error.response) {
      return Promise.reject(error);
    }
  }
)

export default {
  get ({ url, params, headers }) {
    let options = {};
    if (params) options.params = params;
    if (headers) options.headers = headers;
    return axios.get(url, options);
  },

  post ({ url, data, headers }) {

    let options = {};
    // if (data) options.data = qsLib.stringify(data);
    if (headers) options.headers = headers;

    if (!(headers && headers['Content-Type'] && headers['Content-Type'] == 'multipart/form-data')) {
      data = qsLib.stringify(data);
    }

    return axios.post(url, data, options)
  }

}
