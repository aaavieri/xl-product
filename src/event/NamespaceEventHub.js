// import Vue from 'vue'
import Vuex from 'vuex'

// Vue.use(Vuex)
const tab = {
  namespaced: true,
  state: {
    selectedTab: '',
    productDataInit: false,
    productData: []
  },
  mutations: {
    select (state, tabId) {
      state.selectedTab = tabId
    },
    initProductData (state, data) {
      state.productDataInit = true
      state.productData = data
    }
  }
}
const store = new Vuex.Store({
  modules: {
    tab
  }
})

export default store
