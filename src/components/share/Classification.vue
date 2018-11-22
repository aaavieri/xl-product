<template>
  <div class="frame-container">
    <md-card class="page-container no-border" :md-theme="themeName">
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
                  <u style="float: left; width: 100%" v-if="selectProduct.detailUrl">{{selectProduct.detailUrl}}</u>
                  <u style="float: left; width: 100%" v-else>暂无</u>
                </a>
              </div>
            </div>
            <i class="mintui mintui-fuzhi icon-button icon-copy md-elevation-20"
               @click="checkUrl"
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
                  <md-button v-if="!treeItem.showColorSelector"
                             class="md-icon-button md-list-action bottom" @click.stop="cancelFavorite(treeItem)">
                    <md-icon class="mintui mintui-red_star favorite-icon" :style="favoriteIconStyle(treeItem)"/>
                  </md-button>
                  <template v-else>
                    <md-button v-if="userSetting.pageSetting.defaultColorClass"
                               class="md-icon-button md-list-action bottom" @click.stop="selectColorDefault(treeItem)">
                      <md-icon class="mintui" :class="treeItem.color === 'none' ? 'mintui-star-empty' : 'mintui-red_star'"
                               :style="favoriteIconStyle(treeItem)"/>
                    </md-button>
                    <popper v-else trigger="click" :append-to-body="true"
                            :options="{placement: 'left'}"
                            :data-value="treeItem"
                            @show="selectColorStart"
                            @hide="selectColorComplete"	>
                      <div class="color-select-div" >
                      <span class="color-select-span"
                            :style="selectorColorStyle(color)"
                            :class="{'active' : color.colorName === treeItem.color }"
                            @click.stop="selectColor(color, treeItem)"
                            v-for="color in colorList">
                      </span>
                      </div>
                      <md-button slot="reference" class="md-icon-button md-list-action bottom" @click.stop="()=>{}">
                        <md-icon class="mintui" :class="treeItem.color === 'none' ? 'mintui-star-empty' : 'mintui-red_star'"
                                 :style="favoriteIconStyle(treeItem)"/>
                      </md-button>
                    </popper>
                  </template>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </md-app-content>
      </md-app>

      <!--<div class="color-select-div">-->
      <!--<span class="color-select-span"-->
            <!--:style="selectorColorStyle(color)"-->
            <!--:class="{'active' : color.colorName === 'default'}"-->
            <!--@click.stop="selectColor(color, treeItem)"-->
            <!--v-for="color in colorList">-->
      <!--</span>-->
      <!--</div>-->

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
import VuePopper from 'vue-popperjs'
import TabCommon from './TabCommon'
import { mapState } from 'vuex'
let reg = null
export default {
  name: 'Classification',
  components: {
    PopupAction,
    popper: VuePopper
  },
  mixins: [TabCommon],
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
        let productList = this.productData.filter(product => `${product.tableName}-${product.typeId}` === item).map(product => {
          // let ret = Object.assign({},
          //   product, {matchSearch: true, color: 'none', favorite: true})
          // let favoriteItem = this.favoriteList.find(favorite => {
          //   return favorite.tableName === product.tableName && favorite.serial === product.serial
          // }) || {favorite: false}
          // Object.assign(ret, favoriteItem)
          // return ret
          return Object.assign({},
            product, {matchSearch: true, color: 'none', favorite: true, showColorSelector: false},
            this.favoriteList.find(favorite => {
              return favorite.tableName === product.tableName && favorite.serial === product.serial
            }) || {favorite: false, showColorSelector: true}
          )

          // product.matchSearch = true
          // product.color = 'none'
          // product.favorite = this.favoriteList.length > 0 && this.favoriteList.find(favorite => {
          //   return favorite.tableName === item.tableName && favorite.serial === item.serial
          // })
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
    checkUrl () {
      if (!this.selectProduct.detailUrl) {
        this.$toasted.clear()
        this.$toasted.error("无复制内容！", {
          icon: "mintui mintui-alert toast-icon",
          iconPack: "custom-class",
          position: "bottom-center",
          duration : 3000
        });
      }
    },
    onCopy (e) {
      if (this.selectProduct.detailUrl) {
        this.$toasted.clear()
        this.$toasted.success("复制成功！", {
          icon: "mintui mintui-copy toast-icon",
          iconPack: "custom-class",
          position: "bottom-center",
          duration : 3000
        });
      }
    },
    onError (e) {
      this.$toasted.clear()
      this.$toasted.error("复制失败！", {
        icon: "mintui mintui-alert toast-icon",
        iconPack: "custom-class",
        position: "bottom-center",
        duration : 3000
      });
    },
    openUrl () {
      if (this.selectProduct.detailUrl) {
        window.location.href = this.selectProduct.detailUrl
      } else {
        this.$toasted.clear()
        this.$toasted.error("暂无链接！", {
          icon: "mintui mintui-alert toast-icon",
          iconPack: "custom-class",
          position: "bottom-center",
          duration : 3000
        });
      }
    },
    cancelFavorite (item) {
      item.favorite = false
      item.showColorSelector = true
      item.color = 'none'
      let index = this.favoriteList.findIndex(favorite => {
        return favorite.tableName === item.tableName && favorite.serial === item.serial
      })
      if (index > -1) this.favoriteList.splice(index, 1)
    },
    selectorColorStyle (colorData) {
      return {
        'background-color': colorData.colorBk1
      }
    },
    favoriteIconStyle (item) {
      let colorData = this.colorList.find(color => color.colorName === item.color)
      if (!colorData) {
        return {}
      } else if (item.color === 'default') {
        return {
          color: 'rgb(244, 93, 78)!important'
        }
      } else {
        return {
          color: `${colorData.colorBk1}!important`
        }
      }
    },
    selectColorDefault (treeItem) {
      treeItem.favorite = true
      treeItem.color = 'default'
      this.favoriteList.push({
        tableName: treeItem.tableName,
        serial: treeItem.serial,
        color: treeItem.color,
        favoriteOrder: this.favoriteList.length
      })
    },
    selectColorStart (popper) {
      let item = popper.dataValue
      item.favorite = true
      item.color = 'default'
      this.favoriteList.push({
        tableName: item.tableName,
        serial: item.serial,
        color: item.color,
        favoriteOrder: this.favoriteList.length
      })
    },
    selectColor (colorData, item) {
      item.color = colorData.colorName
      this.favoriteList.find(favorite => {
        return favorite.tableName === item.tableName && favorite.serial === item.serial
      }).color = colorData.colorName
    },
    selectColorComplete (popper) {
      let item = popper.dataValue
      item.showColorSelector = false
    }
  },
  computed: {
    ...mapState('share', ['productData'])
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
    },
    favoriteList: {
      handler (value) {
        if (this.userSetting.pageSetting.autoSaveFavorite) {
          this.$settings.setSetting('share', 'favoriteList', value)
          this.$settings.saveSettings()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.initClassList()
  }
}
</script>

<style scoped>

  .color-select-div {
    /*background-color: var(--md-theme-default-text-primary-on-tooltip, #fff);*/
    /*width: 100%;*/
    /*margin-right: 20px;*/
    /*margin-top: 10px;*/
    background-color: rgba(0, 0, 0, 0);
    height: 30px;
    display: flex;
    z-index: 100;
    justify-content: flex-end;
  }

  span.color-select-span {
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    height: 24px;
    margin: auto 3px;
    position: relative;
    z-index: 100;
    width: 24px;
    padding: 8px;
    text-transform: uppercase;
    font-size: 10px;
    color: #fff;
    font-weight: 500;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
  }

  .color-select-div span.active {
    height: 30px;
    width: 30px;
    border: 3px solid #0bf;
    /*border-color: #0bf;*/
  }

  .detail-url {
    float: left;
    width: 100%;
    margin-bottom: 20px;
    display: block;
  }

  .detail-url u {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(0,0,0,0.87)!important;
    width: 100%;
    display: block;
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
  .favorite-icon {
    color: rgb(244, 93, 78)!important;
  }
</style>