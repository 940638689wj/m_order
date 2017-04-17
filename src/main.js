// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import router from './router'
import store from './store'
import mui from '../static/mobile/js/mui.min.js'

Vue.config.productionTip = false

Vue.use(VueResource)
window.mui = mui

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// 时间过滤器
Vue.filter('time', function (value) { // value为13位的时间戳
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
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mi) + ':' + add0(s)
})
