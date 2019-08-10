// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import filters from './filters'
import store from './store'
import axios from 'axios'
import layer from '../static/js/layer.js'

layer.msg = function(str){
  return layer.open({ //提示
    content: str
    ,style: "background-color: #676767; color: #fff;"
    ,shade: false
    ,time: 0.8 //0.8秒后自动关闭
  });
};
layer.alert = function(str){
  return layer.open({ //提示
    content: str,
    btn: ["确定"],
  });
};

layer.mask = function(shade=0.3){
  return layer.open({ //提示
    type: 2,
    shadeClose: false,
    shade: shade
  });
};


axios.interceptors.response.use(response => {
	// console.log(response);
  // 系统报错
  // if (response.data && response.data.err !== 0) {
  //   router.push({name: 'err', query: {code: response.data.err}});
  // }
	//
  return response;
}, error => {
	layer.closeAll(); // 网络出错或接口出错时，隐藏蒙版
})


Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
