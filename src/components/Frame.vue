<template>
  <div>
    <div class="mask" v-show="!loaded">
      <md-progress-spinner :md-diameter="70" :md-stroke="7" md-mode="indeterminate"></md-progress-spinner>
    </div>
    <div class="frame-container frame-self" v-show="loaded">
      <!--<medical :medicalData="medicalData" :selectedTabData="selected"></medical>-->
      <component :is="selected.compName" :selectedTabData="selected">
      </component>
      <md-card class="tabbar-container" :md-theme="selected.themeName">
        <md-bottom-bar md-type="shift" class="my-bottom-bar md-primary md-elevation-20 radius-shape-div" v-bind:md-active-item="selected.id">
          <md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"
                              :key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"
                              @click="clickBottomBar(item)"></md-bottom-bar-item>
        </md-bottom-bar>
      </md-card>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import Medical from './Medical'
import Healthy from './Healthy'
import More from './More'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Frame',
  components: {
    Medical,
    Healthy,
    More
  },
  data () {
    return {
      loaded: false,
      selected: {},
      tabList: [
        {
          id: 'medical',
          name: '医疗版',
          compName: 'Medical',
          themeName: 'default',
          imgSrc: './static/svg/icon-medical.svg'
        },
        {
          id: 'healthy',
          name: '大健康',
          compName: 'Healthy',
          themeName: 'purple-custom',
          imgSrc: './static/svg/icon-healthy.svg'
        },
        {
          id: 'more',
          name: '未完待续',
          compName: 'More',
          themeName: 'pink-custom',
          imgSrc: './static/svg/icon-more.svg'
        }
      ]
    }
  },
  methods: {
    clickBottomBar (item) {
      // 这两行的写法是一样的
      // this.$store.commit('select', item.id)
      this.select(item.id)
    },
    initData () {
      if (this.productDataInit) {
        this.completeLoad()
        return
      }
      let frame = this
      this.$http.get('/api/getData').then(response => {
        if (response.data.success) {
          frame.initProductData(response.data.data)
          frame.completeLoad()
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
      var checkInited = setInterval(() => {
        if (frame.$dictionary.inited && frame.$columnInfo.inited) {
          frame.loaded = true
          var selectedTab = frame.selectedTab || frame.tabList[0].id
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
    ...mapState('tab', { selectedTab: state => state.selectedTab, productDataInit: state => state.productDataInit })
  },
  watch: {
    selectedTab (val) {
      this.selected = this.tabList.find(tab => tab.id === val)
    }
  },
  mounted () {
    if (this.$dictionary.inited && this.$columnInfo.inited) {
      var selectedTab = this.selectedTab || this.tabList[0].id
      this.selected = this.tabList.find(tab => tab.id === selectedTab)
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
