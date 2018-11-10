<template>
  <transition name="dialLightSpeed" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight">
    <md-card class="page-container no-border" :md-theme="selectedTabData.themeName" v-show="startAnimate">
      <md-app md-waterfall md-mode="fixed" class="shape-app">
        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
          <md-button class="md-icon-button">
            <md-icon md-src="./static/svg/icon-menu.svg"/>
          </md-button>
          <span class="md-title" v-show="!searching">{{selectedTabData.name}}</span>
          <md-autocomplete class="search" md-layout="box" :md-fuzzy-search="fuzzySearch"
                           v-model="searchText" v-show="searching" :md-options="searchList" md-dense>
            <label>Search...</label>
          </md-autocomplete>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" v-show="searching" @click="cancelSearch()">
              <md-icon md-src="./static/svg/icon-cancel.svg">取消</md-icon>
            </md-button>
            <md-button class="md-icon-button" v-show="!searching" @click="searching = true">
              <md-icon md-src="./static/svg/icon-search.svg">搜索</md-icon>
            </md-button>
          </div>
          <md-tooltip :md-active.sync="tooltipActive">{{toolTipMsg}}</md-tooltip>
        </md-app-toolbar>
        <md-app-content>
        </md-app-content>
      </md-app>
      <md-speed-dial class="md-bottom-left md-accent" mdEvent="click">
        <md-speed-dial-target>
          <md-icon md-src="./static/svg/icon-plus.svg" class="md-morph-initial">功能</md-icon>
          <md-icon md-src="./static/svg/icon-close.svg" class="md-morph-final">收起</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content>
          <md-button class="md-icon-button" @click="cute()">
            <md-icon md-src="./static/svg/icon-cute.svg">卖萌</md-icon>
          </md-button>

          <md-button class="md-icon-button" @click="joke()">
            <md-icon md-src="./static/svg/icon-joke.svg">搞笑</md-icon>
          </md-button>
        </md-speed-dial-content>
      </md-speed-dial>
    </md-card>
  </transition>
</template>

<script>
const cuteMsg = '我是来卖萌的'
const jokeMsg = '我是来搞笑的'
const closeToolTip = (comp) => {
  comp.tooltipActive = false
}
var timer = null
export default {
  name: 'Healthy',
  data () {
    return {
      searching: false,
      tooltipActive: false,
      toolTipMsg: '',
      fuzzySearch: true,
      startAnimate: false,
      searchList: [],
      searchText: ''
    }
  },
  methods: {
    cancelSearch () {
      this.searchText = ''
      this.searching = false
    },
    cute () {
      this.showTool(cuteMsg)
    },
    joke () {
      this.showTool(jokeMsg)
    },
    showTool (msg) {
      if (timer !== null) clearTimeout(timer)
      this.toolTipMsg = msg
      this.tooltipActive = true
      timer = setTimeout(closeToolTip, 1500, this)
    }
  },
  mounted () {
    this.startAnimate = true
  },
  props: {
    selectedTabData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
  .shape-app {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border: 0px;
    border-radius: 0px;
  }
  .md-app {
    min-height: calc(100vh - 60px);
    max-height: calc(100vh - 60px);
    border: 0px solid rgba(#000, .12);
  }
  .search {
    width: 60vw;
    max-width: 500px;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
  .typeList {
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
  }
</style>
