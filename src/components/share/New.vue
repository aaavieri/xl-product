<template>
  <div class="frame-container">
    <md-card class="page-container no-border" :md-theme="themeName">
      <md-app md-waterfall md-mode="fixed" class="frame-app">
        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
          <!--<span class="md-title" style="margin: 0 auto; text-align: center">我的收藏</span>-->
          <div class="sort-selector">
            <span v-for="sortType in sortTypeList" :key="sortType.sortKey">
              {{sortType.sortName}}
              <i class="md-icon md-icon-font md-elevation-20"
                       @click="setSort(sortType, sortOrder)"
                       :class="{'active': sortType.sortKey === activeSort.sortKey && sortOrder.sortValue === activeSort.sortValue}"
                       :key="sortType.sortKey + sortOrder.sortValue"
                       v-for="sortOrder in sortOrderList">
                {{sortOrder.sortIcon}}
              </i>
            </span>
          </div>
        </md-app-toolbar>
        <md-app-content class="new-content">
          <div class="md-layout">
            <template v-for="(product, index) in displayList">
              <transition enter-active-class="animated fadeIn"
                          leave-active-class="animated fadeOut"
                          :duration="200">
                <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
                     :key="'main' + index">
                  <md-card class="new-card md-elevation-1"
                           md-with-hover>
                    <md-card-header class="new-card-header-left-icon md-layout">
                      <div class="md-layout-item md-size-100">
                        <div class="new-card-left-icon"
                             :style="iconColorStyle(product.color)"
                             @click.stop="setFavoriteIcon(product, true)">
                          <!--<i class="">local_hospital</i>-->
                          <md-icon>{{getTypeIcon(product)}}</md-icon>
                        </div>
                        <transition enter-active-class="animated bounceIn"
                                    leave-active-class="animated bounceOut"
                                    :duration="200">
                          <div class="new-card-left-icon" v-show="product.favorite"
                               :style="iconColorStyle(product.color)"
                               @click.stop="setFavoriteIcon(product, false)">
                            <!--<i class="">local_hospital</i>-->
                            <md-icon class="mintui mintui-red_star" />
                                     <!--:style="favoriteIconStyle(product)"/>-->
                          </div>
                        </transition>
                        <p class="new-card-category">{{product.serial}}</p>
                        <h3 class="new-card-name">{{product.name}}</h3>
                        <h6 class="new-card-sort">{{activeSort.sortName}}：{{product.sortValue}}</h6>
                      </div>
                    </md-card-header>
                    <transition enter-active-class="animated fadeInDown"
                                leave-active-class="animated fadeOutUp"
                                :duration="300">
                      <md-card-content v-show="product.expand && !userSetting.pageSetting.defaultColorNew" class="new-card-color-selector">
                        <div v-click-outside="closeExpand(product)">
                          <span :style="selectorColorStyle(color)"
                                :class="{'active' : color.colorName === product.color}"
                                @click="selectColor(color, product)"
                                v-for="color in colorList">
                          </span>
                        </div>
                      </md-card-content>
                    </transition>
                    <md-card-actions class="new-card-actions" md-alignment="left">
                      <div class="actions-content md-layout">
                        <div class="md-layout-item md-size-80" style="display: flex; align-content: flex-start">
                          <md-icon data-action="url" class="mintui mintui-wt-url"/>
                          <a class="new-url" :href="product.detailUrl">
                            {{product.detailUrl ? product.detailUrl : '暂无'}}
                          </a>
                        </div>
                        <div class="md-layout-item md-size-20 new-card-footer-button-area">
                          <span data-action="copy" class="md-elevation-5"
                                @click="checkCopyItem(product)"
                                v-clipboard:copy="product.detailUrl"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onCopyError">
                            <i class="mintui mintui-copy"></i>复制
                          </span>
                          <!--<div style="display: flex; flex-direction: row" v-show="product.actionStatus === 1">-->
                            <!--<i data-action="up"-->
                               <!--:style="buttonColorStyle(product.color)"-->
                               <!--@click="upItem(product, index, $event)"-->
                               <!--class="md-elevation-20">arrow_upward</i>-->
                            <!--<i data-action="down"-->
                               <!--:style="buttonColorStyle(product.color)"-->
                               <!--@click="downItem(product, index, $event)"-->
                               <!--class="md-elevation-20">arrow_downward</i>-->
                          <!--</div>-->
                          <!--<md-button class="md-raised" :style="buttonColorStyle(favoriteItem.color)">复制</md-button>-->
                        </div>
                      </div>
                    </md-card-actions>
                  </md-card>
                </div>
              </transition>
            </template>
          </div>
        </md-app-content>
      </md-app>
    </md-card>
  </div>
</template>

<script>
import TabCommon from './TabCommon'
import { mapState } from 'vuex'
export default {
  name: 'New',
  mixins: [TabCommon],
  data () {
    return {
      displayList: [],
      activeSort: {sortKey: null, sortName: null, sortBy: null, sortValue: null, sortIcon: null}
    }
  },
  inject: ['Frame'],
  computed: {
    maxDisplayNumber () {
      return this.userSetting.pageSetting.maxDisplayNew
    },
    activeSortKey () {
      return this.activeSort.sortKey
    },
    activeSortValue () {
      return this.activeSort.sortValue
    },
    ...mapState('share', ['productData'])
  },
  watch: {
    activeSortKey () {
      this.sortData()
    },
    activeSortValue () {
      this.sortData()
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
  methods: {
    initData () {
      this.setSort(this.sortOrderList[0], this.sortTypeList[0])
      Object.assign(this.activeSort, this.userSetting.pageSetting.defaultSort)
    },
    setSort (sortOrder, sortType) {
      Object.assign(this.activeSort, sortOrder, sortType)
    },
    sortData () {
      this.displayList = this.productData.map(item => item).sort((item1, item2) => {
        let sortValue1 = item1[this.activeSort.sortKey]
        let sortValue2 = item2[this.activeSort.sortKey]
        return (sortValue1 - sortValue2) * this.activeSort.sortValue
      }).slice(0, this.maxDisplayNumber).map(item => {
        let sortValue = this.$func.dateFormat(item[this.activeSort.sortKey], 'yyyy/MM/dd hh:mm:ss')
        return Object.assign({expand: false, actionStatus: 1, favorite: true, sortValue}, item, this.favoriteList.find(favorite => {
          return favorite.tableName === item.tableName && favorite.serial === item.serial
        }) || {color: 'none', favorite: false})
      })
    },
    getTypeIcon (product) {
      switch (product.tableName) {
        case 't_medical':
          return 'local_hospital'
        case 't_healthy':
          return 'favorite_border'
        default:
          return 'favorite_border'
      }
    },
    closeExpand (product) {
      return () => {
        product.expand = false
      }
    },
    setFavoriteIcon (item, favorite) {
      let needShowMsg = item.favorite !== favorite
      item.expand = favorite
      item.favorite = favorite
      if (!needShowMsg) {
        return
      }
      this.$toasted.clear()
      let msg, type
      if (favorite) {
        item.color = 'default'
        msg = `已添加至我的收藏`
        type = 'success'
        this.favoriteList.push({
          tableName: item.tableName,
          serial: item.serial,
          color: item.color,
          favoriteOrder: this.favoriteList.length
        })
      } else {
        item.color = 'none'
        msg = `已从我的收藏移除`
        type = 'error'
        let index = this.favoriteList.findIndex(favorite => favorite.tableName === item.tableName && favorite.serial === item.serial)
        this.favoriteList.splice(index, 1)
      }
      this.$toasted.show(msg, {
        theme: "bubble",
        icon: "mintui mintui-alert toast-icon",
        type: type,
        iconPack: "custom-class",
        position: "bottom-center",
        duration : 3000
      });
    },
    selectColor (colorData, item) {
      item.color = colorData.colorName
      this.favoriteList.find(favorite => {
        return favorite.tableName === item.tableName && favorite.serial === item.serial
      }).color = colorData.colorName
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
    iconColorStyle (color) {
      color = (color === 'none' ? 'default' : color)
      let colorData = this.colorList.find(item => item.colorName === color)
      return {
        'box-shadow': `0 12px 20px -10px ${colorData.colorShadow1}, 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px ${colorData.colorShadow2}`,
        '-webkit-box-shadow': `0 12px 20px -10px ${colorData.colorShadow1}, 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px ${colorData.colorShadow2}`,
        background: `linear-gradient(60deg,${colorData.colorBk1},${colorData.colorBk2})`
      }
    },
    selectorColorStyle (colorData) {
      return {
        'background-color': colorData.colorBk1
      }
    },
    buttonColorStyle (color) {
      color = (color === 'none' ? 'default' : color)
      let colorData = this.colorList.find(item => item.colorName === color)
      return {
        'background-color': colorData.colorBk1,
        'color': '#FFFFFF'
      }
    },
    maskColorStyle (color) {
      color = (color === 'none' ? 'default' : color)
      let colorData = this.colorList.find(item => item.colorName === color)
      return {
        'background-color': colorData.colorBk1,
        'color': '#FFFFFF'
      }
    },
    checkCopyItem (product) {
      if (!product.detailUrl) {
        this.$toasted.clear()
        this.$toasted.error("无复制内容！", {
          icon: "mintui mintui-alert toast-icon",
          iconPack: "custom-class",
          position: "bottom-center",
          duration : 5000
        });
      }
    },
    onCopy (e) {
      this.$toasted.clear()
      this.$toasted.success("复制成功！", {
        icon: "mintui mintui-copy toast-icon",
        iconPack: "custom-class",
        position: "bottom-center",
        duration : 5000
      });
    },
    onCopyError (e) {
      this.$toasted.clear()
      this.$toasted.error("复制失败！", {
        icon: "mintui mintui-alert toast-icon",
        iconPack: "custom-class",
        position: "bottom-center",
        duration : 5000
      });
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped lang="scss">
  .sort-selector {
    width: 100%;
    height: 50px;
    /*left: 0px;*/
    text-align: center;
    -webkit-box-pack: center;
    justify-content: space-between;
    display: flex;
    color: #ffffff;
    span {
      display: flex;
      font-size: 18px;
      justify-content: center;
      align-items: Center;
      margin: auto 10px;
      i {
        color: #ffffff!important;
        border-radius: 50%;
        cursor: pointer;
        -webkit-box-shadow: 0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2);
        box-shadow: 0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2);
        background: linear-gradient(60deg,#26c6da,#00acc1);
        margin-left: 10px;
      }
      i.active {
        -webkit-box-shadow: 0 12px 20px -10px rgba(233,30,99,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(233,30,99,.2);
        box-shadow: 0 12px 20px -10px rgba(233,30,99,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(233,30,99,.2);
        background: linear-gradient(60deg,#ec407a,#d81b60);
        width: 30px;
        height: 30px;
        margin-left: 7px;
        margin-right: -3px;
      }
    }
  }
  .new-content {
    padding: 30px 0px;
  }
  .new-card {
    width: calc(100% - 20px);
    margin: 0px 4px 24px 4px;
    display: inline-block;
    vertical-align: top;
    text-align: left;
    /*margin-bottom: 20px;*/
  }
  .new-card-header-left-icon {
    text-align: right;
    margin: 0 15px;
    border-radius: 3px;
    padding: 0;
    background-color: transparent;
  }
  .new-card-left-icon {
    border-radius: 3px;
    background-color: #999;
    padding: 15px;
    margin-top: -20px;
    margin-right: 15px;
    float: left;
    text-align: right;
    i {
      font-size: 36px!important;
      line-height: 56px;
      width: 56px;
      height: 56px;
      text-align: center;
      color: #fff!important;
    }
  }
  .new-card-category {
    padding-top: 10px;
    color: #999;
    font-size: 14px;
    margin: 0;
    text-align: right;
  }
  .new-card-name {
    text-decoration: none;
    color: #3c4858;
    text-align: right;
    margin-bottom: 5px;
  }
  .new-card-sort {
    text-decoration: none;
    color: #3c4858;
    text-align: right;
    margin: 0;
  }
  .new-card-delete-button-area div[data-action="delete"] {
    background: linear-gradient(60deg, #ec407a, #d81b60);
    display: flex;
    justify-content:center;
    width: 100%;
    height: 100%;
  }
  .new-card-color-selector {
    /*position: absolute;*/
    z-index: -1;
    /*top: 0px;*/
    width: 100%;
    height: 30px;
    /*left: 0px;*/
    text-align: center;
    -webkit-box-pack: center;
    justify-content: center;
    display: flex;
    /*border-bottom: 1px solid #ddd;*/
    span {
      border: 3px solid #fff;
      border-radius: 50%;
      cursor: pointer;
      display: inline-block;
      height: 23px;
      margin-right: 5px;
      position: relative;
      width: 23px;
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
    span.active {
      border-color: #0bf;
    }
  }

  .new-card-actions {
    line-height: 22px;
    color: #999;
    font-size: 12px;
    margin-top: 0px;
    margin-right: 15px;
    margin-bottom: 10px;
    margin-left: 15px;
    font-size: 14px;
    padding: 10px 0 0 0;
    border-top: 1px solid #eee;
    div.actions-content {
      max-width: 100%;
      i[data-action="url"] {
        margin: auto 10px;
        position: relative;
        top: -1px;
        font-size: 16px !important;
        color: #999;
      }
    }
  }
  .new-url {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
    line-height: 30px;
  }

  .new-card-footer-button-area {
    display: inline-flex;
    justify-content: flex-start;
    span[data-action="copy"] {
      /*background: linear-gradient(60deg, #ec407a, #d81b60);*/
      background-color: #99CC33;
      display: inline-block;
      margin: auto -20px -20px auto;
      /*word-wrap: break-word;*/
      white-space: normal;
      width: 72px;
      font-size: 18px;
      padding: 8px;
      color: #ffffff;
      border-radius: 15%;
      cursor: pointer;
      i {
        font-size: 18px;
      }
    }
    div[data-action="copy"] {
      background: linear-gradient(60deg, #ec407a, #d81b60);
      display: flex;
      justify-content:center;
      width: 100%;
      height: 100%;
    }
    i[data-action="up"],
    i[data-action="down"] {
      margin: 20px 10px -20px 0px;
      background-color: #fff;
      padding: 7px;
      border-radius: 50%;
      max-width: 38px;
      max-height: 38px;
      // -webkit-box-shadow: 0 16px 38px -12px rgba(0, 0, 0, .56), 0 4px 25px 0 rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2);
      // box-shadow: 0 16px 38px -12px rgba(0, 0, 0, .56), 0 4px 25px 0 rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2);
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
  }
  .swipe-info-part {
    padding-right: 15px;
  }

</style>