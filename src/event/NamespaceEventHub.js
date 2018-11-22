// import Vue from 'vue'
import Vuex from 'vuex'
import {Func} from '../plugins/FuncPlugin'

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
    selectedTabId: 2,
    step: 1,
    maxStep: 3,
    productData: [],
    productDataInit: false,
    defaultSetting: {
      accountSetting: {
        saveUserName: true,
        savePassword: false
      },
      pageSetting: {
        autoSaveFavorite: false,
        defaultColorClass: false,
        defaultColorNew: false,
        defaultSort: {
          sortKey: 'updateTime',
          sortName: '更新时间',
          sortBy: 'desc',
          sortValue: -1,
          sortIcon: 'arrow_downward'
        },
        maxDisplayNew: 10
      }
    },
    dbSetting: {
      accountSetting: {},
      pageSetting: {}
    },
    favoriteList: []
  },
  mutations: {
    setDbSetting (state, setting) {
      // state.dbSetting = setting
      Func.deepAssign(state.dbSetting, setting)
    },
    setFavoriteList (state, favoriteList) {
      if (state.favoriteList.length > 0) {
        state.favoriteList.splice(0, state.favoriteList.length)
      }
      let temp = favoriteList || []
      temp.map(item => {
        state.favoriteList.push(Func.deepAssign({}, item))
      })
      // Func.deepAssign(state.favoriteList, favoriteList || [])
    },
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
  },
  getters: {
    userSetting (state) {
      return Func.deepAssign({}, state.defaultSetting, state.dbSetting)
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
