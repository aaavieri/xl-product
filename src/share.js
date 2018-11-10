import Vue from 'vue'
import App from './Product.vue'
import router from './router/product'

import './assets/css/pink.scss'
import './assets/css/green.scss'
import './assets/css/custom.scss'
import './assets/css/comp.css'
import './assets/js/love'
import store from './event'
import DictionaryPlugin from './plugins/DictionaryPlugin'
import HttpPlugin from './plugins/HttpPlugin'
import ColumnInfoPlugin from './plugins/ColumnInfoPlugin'

Vue.use(DictionaryPlugin)
Vue.use(HttpPlugin)
Vue.use(ColumnInfoPlugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
