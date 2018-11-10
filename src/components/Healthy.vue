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
        </md-app-toolbar>
        <md-app-content>
          <md-list>
            <md-list-item md-expand class="typeList" v-for="(item, index) in treeData"
                          :key="'group' + index" :md-expanded.sync="item.open">
              <md-icon md-src="./static/svg/icon-healthy-type.svg"></md-icon>
              <span class="md-list-item-text">{{item.name}}</span>
              <md-list slot="md-expand">
                <md-list-item class="md-inset has-ripple" v-for="(treeItem, treeIndex) in item.children" v-show="!searching || treeItem.matchSearch"
                              :key="'group' + index + 'item' + treeIndex" @click="showToolTip(treeItem)">
                  <div class="md-list-item-text">
                    <span>{{treeItem.name}}</span>
                    <p>{{treeItem.serial}}</p>
                  </div>
                  <md-button class="md-icon-button md-list-action" @click.stop="clickDetail(treeItem)">
                    <md-icon md-src="./static/svg/icon-healthy-detail.svg">详情</md-icon>
                  </md-button>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </md-app-content>
      </md-app>
      <md-speed-dial class="md-bottom-left" mdEvent="click">
        <md-speed-dial-target>
          <md-icon md-src="./static/svg/icon-plus.svg" class="md-morph-initial">功能</md-icon>
          <md-icon md-src="./static/svg/icon-close.svg" class="md-morph-final">收起</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content>
          <md-button class="md-icon-button" @click="changeAllStatus(true)">
            <md-icon md-src="./static/svg/icon-expand.svg">展开</md-icon>
          </md-button>

          <md-button class="md-icon-button" @click="changeAllStatus(false)">
            <md-icon md-src="./static/svg/icon-collapse.svg">折叠</md-icon>
          </md-button>
        </md-speed-dial-content>
      </md-speed-dial>
    </md-card>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import swal from 'sweetalert2'
var reg = new RegExp('', 'i')
export default {
  name: 'Healthy',
  data () {
    return {
      searchText: '',
      searching: false,
      startAnimate: false,
      searchList: [],
      fuzzySearch: true,
      treeData: []
    }
  },
  computed: {
    ...mapState('tab', { healthyData: state => state.productData.filter(item => item.tableName === 't_healthy') })
  },
  methods: {
    cancelSearch () {
      this.searchText = ''
      this.searching = false
    },
    changeAllStatus (status) {
      this.treeData.map(item => {
        item.open = status
      })
    },
    showToolTip (treeItem) {
      // treeItem.tooltipActive = true
      // setTimeout(closeToolTip, 1500, treeItem)
      swal({
        title: treeItem.serial,
        text: treeItem.name,
        type: 'info',
        confirmButtonClass: 'md-primary md-button md-raised md-primary md-button-content md-theme-default',
        confirmButtonText: 'OK',
        buttonsStyling: false
      })
    },
    clickDetail (treeItem) {
      this.$router.push({
        name: 'HealthyDetail',
        params: Object.assign({}, {rowData: treeItem}, {themeName: this.selectedTabData.themeName})
      })
    },
    generateTreeData (data) {
      let healthy = this
      var treeData = []
      data.map(item => {
        var typeData = treeData.find(tree => tree.id === item.typeId)
        if (!typeData) {
          typeData = {
            id: item.typeId,
            name: healthy.$dictionary.getName('t_healthy', 'typeId', item.typeId),
            open: false,
            children: []
          }
          treeData.push(typeData)
        }
        typeData.children.push(item)
      })
      this.treeData = treeData
    }
  },
  watch: {
    searchText (val) {
      var needSearch = val.trim() !== ''
      this.treeData.map((item, index) => {
        item.open = false
        if (index === 0 && needSearch) reg = new RegExp(val, 'i')
        item.children.map(child => {
          child.matchSearch = !needSearch || reg.test(child.name) || reg.test(child.serial)
          item.open = needSearch && (item.open || child.matchSearch)
        })
      })
    }
  },
  mounted () {
    this.generateTreeData(this.healthyData)
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
