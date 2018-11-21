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
import TableDragPlugin from './plugins/TableDragPlugin'
import FuncPlugin from './plugins/FuncPlugin'

import VueMaterial from 'vue-material'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'
import vueTouchEvents from 'vue2-touch-events'
import VuePopper from 'vue-popperjs'

Vue.use(VueMaterial)
Vue.use(VueClipboard)
Vue.use(Toasted)
Vue.use(vueTouchEvents)
Vue.use(VuePopper)

Vue.use(DictionaryPlugin)
Vue.use(HttpPlugin)
Vue.use(ColumnInfoPlugin)
Vue.use(SettingsPlugin)
Vue.use(TableDragPlugin)
Vue.use(FuncPlugin)
// Vue.use(NotificationPlugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
