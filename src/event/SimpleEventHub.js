// import Vue from 'vue'
import Vuex from 'vuex'

// Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    selectedTab: ''
  },
  mutations: {
    select (state, tabId) {
      state.selectedTab = tabId
    }
  }
})

export default store
