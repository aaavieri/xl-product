import Vue from 'vue'
import App from './Share.vue'
import router from './router/share'

import './assets/css/pink.scss'
import './assets/css/green.scss'
import './assets/css/custom.scss'
import './assets/css/comp.css'
import './assets/js/love'
import store from './event'
import DictionaryPlugin from './plugins/DictionaryPlugin'
import HttpPlugin from './plugins/HttpPlugin'
import ColumnInfoPlugin from './plugins/ColumnInfoPlugin'
import SettingsPlugin from './plugins/SettingsPlugin'
import VueMaterial from 'vue-material'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'


Vue.use(VueMaterial)
Vue.use(VueClipboard)
Vue.use(Toasted)
Vue.use(DictionaryPlugin)
Vue.use(HttpPlugin)
Vue.use(ColumnInfoPlugin)
Vue.use(SettingsPlugin)
// Vue.use(NotificationPlugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
