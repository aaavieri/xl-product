<template>
  <div>
    <div class="mask" v-show="!loaded">
      <md-progress-spinner :md-diameter="70" :md-stroke="7" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div class="frame-container frame-self" v-show="loaded">
      <!--<medical :medicalData="medicalData" :selectedTabData="selected"></medical>-->
      <!--<md-card class="tabbar-container" :md-theme="selected.themeName">-->
        <!--<md-bottom-bar md-type="shift" class="my-bottom-bar md-primary md-elevation-20 radius-shape-div" v-bind:md-active-item="selected.id">-->
          <!--<md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"-->
                              <!--:key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"-->
                              <!--@click="clickBottomBar(item)"></md-bottom-bar-item>-->
        <!--</md-bottom-bar>-->
      <!--</md-card>-->
      <md-card class="page-container no-border">
        <md-app md-waterfall md-mode="fixed" class="frame-app">
          <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
            <md-button class="md-icon-button">
              <md-icon>menu</md-icon>
            </md-button>
            <span class="md-title" v-show="!searching">{{selected.name}}</span>
            <md-autocomplete class="search" md-layout="box" :md-fuzzy-search="fuzzySearch"
                             v-model="searchText" v-show="searching" :md-options="searchList" md-dense>
              <label>Search...</label>
            </md-autocomplete>
            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button" v-show="searching" @click="cancelSearch()">
                <md-icon>undo</md-icon>
              </md-button>
              <md-button class="md-icon-button" v-show="!searching" @click="searching = true">
                <md-icon>search</md-icon>
              </md-button>
            </div>
          </md-app-toolbar>
          <md-app-content>
            <md-list>
              <md-list-item md-expand class="typeList" v-for="(item, index) in treeData"
                            :key="'group' + index" :md-expanded.sync="item.open">
                <md-icon>rounded_corner</md-icon>
                <span class="md-list-item-text">{{item.name}}</span>
                <md-list slot="md-expand">
                  <md-list-item class="md-inset has-ripple" v-for="(treeItem, treeIndex) in item.children" v-show="!searching || treeItem.matchSearch"
                                :key="'group' + index + 'item' + treeIndex" @click="showToolTip(treeItem)">
                    <div class="md-list-item-text">
                      <span>{{treeItem.name}}</span>
                      <p>{{treeItem.serial}}</p>
                    </div>
                    <md-button class="md-icon-button md-list-action" @click.stop="clickDetail(treeItem)">
                      <md-icon>open_in_new</md-icon>
                    </md-button>
                  </md-list-item>
                </md-list>
              </md-list-item>
            </md-list>
          </md-app-content>
        </md-app>
        <md-speed-dial class="md-bottom-left" mdEvent="click" >
          <md-speed-dial-target>
            <md-icon class="md-morph-initial">add</md-icon>
            <md-icon class="md-morph-final">clear</md-icon>
          </md-speed-dial-target>

          <md-speed-dial-content>
            <md-button class="md-icon-button" @click="changeAllStatus(true)">
              <md-icon>unfold_more</md-icon>
            </md-button>

            <md-button class="md-icon-button" @click="changeAllStatus(false)">
              <md-icon>unfold_less</md-icon>
            </md-button>
          </md-speed-dial-content>
        </md-speed-dial>
      </md-card>
      <md-card class="tabbar-container">
        <md-bottom-bar md-type="fixed" class="my-bottom-bar md-primary md-elevation-20 radius-shape-div" v-bind:md-active-item="selected.id">
          <md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"
                              :key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"
                              @click="clickBottomBar(item)"></md-bottom-bar-item>
        </md-bottom-bar>
      </md-card>
    </div>
  </div>
</template>

<script>
// import swal from 'sweetalert2'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Frame',
  data () {
    return {
      loaded: false,
      selected: {},
      allData: [],
      searchText: '',
      searching: false,
      searchList: [],
      fuzzySearch: true,
      treeData: [],
      tabList: [
        {
          id: 'medical',
          name: '医疗版',
          compName: 'Medical',
          themeName: 'default',
          imgSrc: 'local_hospital'
        },
        {
          id: 'healthy',
          name: '大健康',
          compName: 'Healthy',
          themeName: 'purple-custom',
          imgSrc: 'favorite_border'
        },
        {
          id: 'more',
          name: '未完待续',
          compName: 'More',
          themeName: 'pink-custom',
          imgSrc: 'more_horiz'
        }
      ]
    }
  },
  methods: {
    cancelSearch () {
      this.searchText = ''
      this.searching = false
    },
    changeAllStatus (status) {
      this.treeData.map(function (item) {
        item.open = status
      })
    },
    showToolTip (treeItem) {
//			treeItem.tooltipActive = true
//			setTimeout(closeToolTip, 1500, treeItem)
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
				name: 'Detail',
				params: {detail: treeItem}
			})
    },
    clickBottomBar (item) {
      // 这两行的写法是一样的
      // this.$store.commit('select', item.id)
      this.select(item.id)
      this.$nextTick(() => {
        let selectTabId = this.selected.id
        let data = this.allData.filter(item => item.tableName === `t_${selectTabId}`)
        this.generateTreeData(data)
      })
    },
    generateTreeData (data) {
      let frame = this
      let treeData = []
      data.map(item => {
        let typeData = treeData.find(tree =>  tree.id === item.typeId)
        if (!typeData) {
          let typeObject = this.$dictionary.getObject(`t_${frame.selected.id}`, 'typeId', item.typeId)
          typeData = {
            id: item.typeId,
            name: typeObject.name,
            displayOrder: typeObject.displayOrder,
            open: false,
            children: []
          }
          treeData.push(typeData)
        }
        typeData.children.push(item)
      })
      treeData.sort((el1, el2) => el1.displayOrder - el2.displayOrder)
      this.treeData = treeData
    },
    initData () {
      if (this.productDataInit) {
        this.allData = this.productData
        this.completeLoad()
        return
      }
      let frame = this
      this.$http.get('/api/getData').then(response => {
        if (response.data.success) {
          frame.initProductData(response.data.data)
          frame.allData = response.data.data
          frame.completeLoad()
          frame.clickBottomBar(this.tabList[0])
        } else {
          swal({
            title: '数据检索失败!',
            text: response.data.errMsg,
            type: 'error',
            confirmButtonClass: 'md-primary md-button md-raised md-primary md-button-content md-theme-default',
            confirmButtonText: 'OK',
            buttonsStyling: false
          })
        }
      })
    },
    completeLoad () {
      let frame = this
      let checkInited = setInterval(() => {
        if (frame.$dictionary.inited && frame.$columnInfo.inited) {
          frame.loaded = true
          let selectedTab = frame.selectedTab || frame.tabList[0].id
          frame.selected = frame.tabList.find(tab => tab.id === selectedTab)
          clearInterval(checkInited)
        }
      }, 100)
    },
    // 下面一行是使用SimpleEventHub和MultiModuleEventHub的写法
    // ...mapMutations(['select'])
    // 下面两行是使用NamespaceEventHub的写法
    // ...mapMutations(['tab/select'])
    ...mapMutations('tab', ['select', 'initProductData'])
  },
  computed: {
    // 下面一行是使用SimpleEventHub和的写法
    // ...mapState(['selectedTab'])
    // 下面一行是使用MultiModuleEventHub和NamespaceEventHub都能用的写法
    // ...mapState({ selectedTab: state => state.tab.selectedTab })
    // 下面一行是使用NamespaceEventHub专用的写法
    ...mapState('tab', {
      selectedTab: state => state.selectedTab,
      productDataInit: state => state.productDataInit,
      productData: state => state.productData
    })
  },
  watch: {
    selectedTab (val) {
      this.selected = this.tabList.find(tab => tab.id === val)
    }
  },
  mounted () {
    if (this.$dictionary.inited && this.$columnInfo.inited) {
      let selectedTab = this.selectedTab || this.tabList[0].id
      this.selected = this.tabList.find(tab => tab.id === selectedTab)
      this.clickBottomBar(this.selected)
    }
    this.$dictionary.initData(this.$http)
    this.$columnInfo.initData(this.$http)
    this.initData()
  }
}
</script>

<style scoped>
  .mask {
    position: fixed;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    display:flex;
    justify-content:center;
    align-items:center;
    background: rgba(0, 0, 0, 0.4);
  }
  .frame-container {
    width: 100%;
    /*display: inline-flex;*/
    /*overflow: hidden;*/
    /*border: 1px solid rgba(#000, 0.26);*/
    /*background: rgba(#000, 0.06);*/
  }
  .frame-self {
    height: 100%;
  }
  /*.page-container {*/
    /*height: available*/
  /*}*/
  .tabbar-container {
    height: 60px;
    width: 100%;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden;
    border: 0px solid rgba(#000, 0.26);
    background: rgba(#000, 0.06);
    position: fixed;
    bottom: 0;
  }
  .my-bottom-bar {
    height: 50px;
  }
</style>
