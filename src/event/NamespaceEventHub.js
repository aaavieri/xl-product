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

const share = {
  namespaced: true,
  state: {
    // TODO
    selectedTabId: 2,
    step: 1,
    maxStep: 3,
    productData: [],
    productDataInit: false
  },
  mutations: {
    selectTab (state, tabId) {
      state.selectedTabId = tabId
    },
    goNextStep (state) {
      state.step = Math.min(state.step + 1, state.maxStep)
    },
    goStep (state, step) {
      state.step = Math.min(step, state.maxStep)
    },
    initProductData (state, data) {
      state.productDataInit = true
      state.productData = data
    }
  }
}

const store = new Vuex.Store({
  modules: {
    tab,
    share
  }
})

export default store
