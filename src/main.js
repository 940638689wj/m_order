// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import {Upload, Dialog} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Upload)
Vue.use(Dialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// 时间过滤器
Vue.filter('time', function (value, type) { // value为13位的时间戳
  type = type || 'datetime'
  if (!value) {
    return ''
  }
  function add0 (m) {
    return m < 10 ? '0' + m : m
  }

  var time = new Date(parseInt(value))
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mi = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + (type === 'date' ? '' : (' ' + add0(h) + ':' + add0(mi) + ':' + add0(s)))
})
