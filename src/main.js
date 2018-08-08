// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment/moment'
// import VueSocketio from 'vue-socket.io'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import * as filters from './filters' // 全局filter

Vue.use(ElementUI)
// Vue.use(VueSocketio, 'http://127.0.0.1:9100')
Vue.config.productionTip = false
Vue.prototype.moment = moment
Vue.prototype.nativeFun = function (opt, param1, param2) {
  console.log('进入方法' + opt)
  if (window.native) {
    console.log(opt)
    return arguments.length === 1 ? window.native[opt]() : arguments.length === 2 ? window.native[opt](param1) : window.native[opt](param1, param2)
  }
}
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const whiteList = ['/login']// 不重定向白名单
router.beforeEach((to, from, next) => {
  // next()
  if (store.getters.status) { // 判断是否登录
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to }) // hack方法 确保addRoutes已完成
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            // Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount('#app')
