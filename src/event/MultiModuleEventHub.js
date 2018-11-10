// import Vue from 'vue'
import Vuex from 'vuex'

// Vue.use(Vuex)
const tab = {
  state: {
    selectedTab: ''
  },
  mutations: {
    select (state, tabId) {
      state.selectedTab = tabId
    }
  }
}
const store = new Vuex.Store({
  modules: {
    tab
  }
})

export default store
