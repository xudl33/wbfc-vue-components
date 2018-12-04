// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(router);
Vue.use(ElementUI);

import WbfcComponents from '../index.js'
console.log("router = %o", router);
Vue.use(WbfcComponents, {
	WbfcActionPath: {

	},
	WbfcHttps: {
		router: router
	}
});

Vue.$wbfc.Errors.addMapping('999', 'aaa');
Vue.$wbfc.ActionPath.addMatch({
  'system': {
    urlReg: '/area/linkageList',
    path: 'http://192.168.20.5:1106/system'
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
