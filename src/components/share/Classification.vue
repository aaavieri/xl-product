<template>
  <div class="frame-container frame-self">
    <md-card class="page-container no-border">
      <md-app md-waterfall md-mode="fixed" class="frame-app">
        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
          <md-button class="md-icon-button">
            <md-icon>menu</md-icon>
          </md-button>
          <!--<div class="md-title" v-show="!searching">-->
            <!--<md-button class="md-accent">全部</md-button>-->
            <!--<md-button class="md-primary">医疗版</md-button>-->
            <!--<md-button class="md-primary">大健康</md-button>-->
          <!--</div>-->
          <!--<div class="select-class">-->
            <!--<md-icon>home</md-icon>-->
            <!--<md-field v-show="!searching" class="select-field" style="display: inline-flex">-->
              <!--<md-select class="md-title select-input" v-model="selectClass">-->
                <!--<md-option value="all">全部</md-option>-->
                <!--<md-option value="t_medical">医疗版</md-option>-->
                <!--<md-option value="t_healthy">大健康</md-option>-->
              <!--</md-select>-->
            <!--</md-field>-->
          <!--</div>-->
          <!--<span class="md-title" v-show="!searching">产品目录</span>-->
          <md-autocomplete class="search" md-layout="box"
                           v-model="searchText" :md-options="searchList" md-dense>
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
          <popup-action :show.sync="showPopUp"
                        verticalAlign="top"
                        horizontalAlign="center"
                        :title="selectProduct.name"
                        type="primary"
                        :initialMargin="70"
                        :closeOnClick="false"
                        icon="notification_important"
                        :timeout="0">
            <!--<div style="display: flex">-->
                <!--<span>详细页地址</span><md-icon>file_copy</md-icon>-->
                <!--<a :href="selectProduct.detailUrl">https://www.baidu.com</a>-->
            <!--</div>-->
            <div class="md-layout" ref="copyContainer">
              <div class="md-layout-item" style="float: left; width: 100%">
                <a class="detail-url" :href="selectProduct.detailUrl">
                  <u style="float: left" v-if="selectProduct.detailUrl">{{selectProduct.detailUrl}}</u>
                  <u style="float: left" v-else>暂无</u>
                </a>
              </div>
            </div>
            <i class="mintui mintui-fuzhi icon-button icon-copy md-elevation-20"
               v-clipboard:copy="selectProduct.detailUrl"
               v-clipboard:success="onCopy"
               v-clipboard:error="onError"></i>
            <i class="mintui mintui-icon_open-in-new icon-button icon-open md-elevation-20" @click="openUrl"></i>
          </popup-action>
          <md-list>
            <md-list-item md-expand class="typeList" v-for="(item, index) in classList"
                          :key="'group' + index" :md-expanded.sync="item.open">
              <md-icon>rounded_corner</md-icon>
              <span class="md-list-item-text">{{item.tableComment}}---{{item.typeName}}</span>
              <md-list slot="md-expand">
                <md-list-item class="md-inset has-ripple" v-for="(treeItem, treeIndex) in item.productList" v-show="treeItem.matchSearch"
                              :key="'group' + index + 'item' + treeIndex" @click="showToolTip(treeItem)">
                  <div class="md-list-item-text">
                    <span>{{treeItem.name}}</span>
                    <p>{{treeItem.serial}}</p>
                  </div>
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
  </div>
</template>

<script>
import PopupAction from '../common/PopupAction'
import { mapState, mapMutations } from 'vuex'
let reg = null
export default {
  name: 'Classification',
  components: {
    PopupAction
  },
  data () {
    return {
      classList: [],
      searching: false,
      searchList: [],
      searchText: '',
      selectClass: 'all',
      showPopUp: false,
      selectProduct: {}
    }
  },
  methods: {
    initClassList () {
      let classSet = new Set(this.productData.map(item => `${item.tableName}-${item.typeId}`))
      this.classList = Array.from(classSet).map(item => {
        let productList = this.productData.filter(product => `${product.tableName}-${product.typeId}` === item).map(item => {
          item.matchSearch = true
          return item
        })
        let {typeId, tableName} = productList[0]
        let typeName = this.$dictionary.getName(tableName, 'typeId', typeId)
        let tableComment = this.getTableComment(tableName)
        return {
          key: item,
          open: false,
          tableName,
          typeId,
          typeName,
          tableComment,
          productList
        }
      })
    },
    getTableComment(tableName) {
      let tableComment = ''
      switch (tableName) {
        case 't_medical':
          tableComment = '医疗版'
          break
        case 't_healthy':
          tableComment = '大健康'
          break
        default:
          tableComment = '医疗版'
      }
      return tableComment
    },
    cancelSearch () {
      this.searchText = ''
      this.searching = false
    },
    changeAllStatus (status) {
      this.classList.map((item) => {
        item.open = status
      })
    },
    showToolTip (treeItem) {
      this.showPopUp = true
      this.selectProduct = treeItem
    },
    onCopy (e) {
      this.$toasted.clear()
      if (this.selectProduct.detailUrl) {
        this.$toasted.success("复制成功！", {
          icon: "content-copy",
          iconPack: "mdi",
          position: "bottom-center",
          duration : 5000
        });
      } else {
        this.$toasted.error("无复制内容！", {
          icon: "message-alert-outline",
          iconPack: "mdi",
          position: "bottom-center",
          duration : 5000
        });
      }
    },
    onError (e) {
      this.$toasted.clear()
      this.$toasted.error("复制失败！", {
        icon: "message-alert-outline",
        iconPack: "mdi",
        position: "bottom-center",
        duration : 5000
      });
    },
    openUrl () {
      if (this.selectProduct.detailUrl) {
        window.location.href = this.selectProduct.detailUrl
      }
    },
    ...mapMutations('share', ['selectTab', 'initProductData', 'goNextStep', 'goLogin'])
  },
  computed: {
    ...mapState('share', {
      productData: state => state.productData
    })
  },
  watch: {
    searchText (val) {
      let needSearch = val.trim() !== ''
      this.classList.map((item, index) => {
        item.open = false
        if (index === 0 && needSearch) reg = new RegExp(val, 'i')
        item.productList.map((child) => {
          child.matchSearch = !needSearch || reg.test(child.name) || reg.test(child.serial)
          item.open = needSearch && (item.open || child.matchSearch)
        })
      })
    }
  },
  mounted () {
    this.initClassList()
  }
}
</script>

<style scoped>
  .detail-url {
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    float: left;
    width: 100%;
    color: rgba(0,0,0,0.87)!important;
    margin-bottom: 20px;
  }
  .frame-container {
    width: 100%;
  }
  .frame-self {
    height: 100%;
  }

  .icon-copy {
    right: 40px;
    bottom: -10px;
  }

  .icon-open {
    right: 5px;
    bottom: -10px;
  }

  i:active.icon-button {
    background-color: #fa764b;
    color: #fff;
  }

  .icon-button {
    display: block;
    /*left: 15px;*/
    /*margin-top: -30px;*/
    position: absolute;
    background-color: #fff;
    padding: 7px;
    border-radius: 50%;
    max-width: 38px;
    max-height: 38px;
    -webkit-box-shadow: 0 16px 38px -12px rgba(0, 0, 0, .56), 0 4px 25px 0 rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2);
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, .56), 0 4px 25px 0 rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2);
    color: #fa764b;
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 16px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
</style>