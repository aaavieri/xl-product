<template>
  <div class="app-container">
    <md-card class="page-container no-border" :md-theme="themeName">
      <md-app md-waterfall md-mode="fixed" class="frame-app">
        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div" style="display: inline-flex; justify-content: space-between;">
          <!--<span class="md-title" style="margin: 0 auto; text-align: center">我的收藏</span>-->
          <md-button v-if="!userSetting.pageSetting.autoSaveFavorite" class="md-icon-button" @click="restoreFavoriteList">
            <md-icon class="mintui mintui-cancel"/>
          </md-button>
          <div class="card-product-color-selector" style="height: 100%; flex-grow: 1">
            <span style="background-color: #ffffff; color: #1b1e21; padding: 3px"
                  :class="{'active' : selectedColor === 'all'}" @click="selectedColor = 'all'">
              全
            </span>
            <span :style="selectorColorStyle(color)"
                  :class="{'active' : color.colorName === selectedColor}"
                  @click="selectedColor = color.colorName"
                  v-for="color in colorList">
            </span>
          </div>
          <md-button v-if="!userSetting.pageSetting.autoSaveFavorite" class="md-icon-button" @click="saveFavoriteList">
            <md-icon class="mintui mintui-save1"/>
          </md-button>
        </md-app-toolbar>
        <md-app-content class="favorite-content">
          <md-empty-state v-if="favoriteProductList.length === 0"
                          md-icon="devices_other"
                          md-label="暂无收藏咯"
                          md-description="请在分类列表挑选你最常用的产品收藏吧.">
            <div style="display: flex; justify-content: space-between; width: 80%">
              <md-button @click="goClassification" class="md-primary md-raised">前往分类列表</md-button>
              <md-button @click="goNew" class="md-primary md-raised">查看最新产品</md-button>
            </div>
          </md-empty-state>
          <div class="md-layout" v-else>
            <template v-for="(favoriteItem, index) in favoriteProductList">
              <transition enter-active-class="animated fadeIn"
                          leave-active-class="animated fadeOut"
                          :duration="200">
                <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25 drag-div"
                     :key="'main' + index"
                     ref="productCard"
                     v-show="selectedColor === 'all' || favoriteItem.color === selectedColor"
                     :data-index="favoriteItem.id">
                  <md-card class="product-card md-elevation-1"
                           v-touch:swipe.left="swipeLeft(index)"
                           v-touch:swipe.right="swipeRight(index)"
                           md-with-hover :data-index="favoriteItem.id">
                    <md-card-header class="md-card-header-left-icon md-layout">
                      <div class="md-layout-item" :class="infoPartClass(favoriteItem)">
                        <div class="card-left-icon"
                             :style="iconColorStyle(favoriteItem.color)"
                             @click.stop="favoriteItem.expand = !favoriteItem.expand">
                          <!--<i class="">local_hospital</i>-->
                          <md-icon>{{getTypeIcon(favoriteItem)}}</md-icon>
                        </div>
                        <p class="card-product-category">{{favoriteItem.serial}}</p>
                        <h3 class="card-product-name">{{favoriteItem.name}}</h3>
                      </div>
                      <div class="md-layout-item md-layout-item card-product-delete-button-area"
                           :class="operationPartClass(favoriteItem)"
                           @click="deleteItem(favoriteItem, index)">
                        <md-icon style="color: #ffffff" v-show="favoriteItem.actionStatus === 2">delete</md-icon>
                      </div>
                    </md-card-header>
                    <transition enter-active-class="animated fadeInDown"
                                leave-active-class="animated fadeOutUp"
                                :duration="300">
                      <md-card-content v-show="favoriteItem.expand" class="card-product-color-selector">
                        <div v-click-outside="closeExpand(favoriteItem)">
                          <span :style="selectorColorStyle(color)"
                                :class="{'active' : color.colorName === favoriteItem.color}"
                                @click="favoriteItem.color = color.colorName"
                                v-for="color in colorList">
                          </span>
                        </div>
                      </md-card-content>
                    </transition>
                    <md-card-content class="card-product-mask">
                      <i :style="maskColorStyle(favoriteItem.color)"
                         @click="checkCopyItem(favoriteItem)"
                         v-clipboard:copy="favoriteItem.detailUrl"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onCopyError"
                         class="mintui mintui-copy"></i>
                      <i :style="maskColorStyle(favoriteItem.color)"
                         @click="deleteItem(favoriteItem, index)"
                         class="mintui mintui-trash-gray"></i>
                    </md-card-content>
                    <md-card-actions class="card-product-actions" md-alignment="left">
                      <div class="actions-content md-layout">
                        <div class="md-layout-item md-size-70" style="display: flex; align-content: flex-start">
                          <md-icon class="mintui mintui-wt-url"/>
                          <a class="favorite-url" :href="favoriteItem.detailUrl">
                            {{favoriteItem.detailUrl ? favoriteItem.detailUrl : '暂无'}}
                          </a>
                        </div>
                        <div v-show="favoriteItem.actionStatus === 1" class="md-layout-item md-size-30 card-product-footer-button-area" style="justify-content: flex-end">
                          <div style="display: flex; flex-direction: row; justify-content: flex-end">
                            <i data-action="up"
                               :style="buttonColorStyle(favoriteItem.color)"
                               @click="upItem(favoriteItem, index, $event)"
                               class="md-elevation-20">arrow_upward</i>
                            <i data-action="down"
                               :style="buttonColorStyle(favoriteItem.color)"
                               @click="downItem(favoriteItem, index, $event)"
                               class="md-elevation-20">arrow_downward</i>
                          </div>
                        </div>
                        <template>
                          <div class="md-layout-item md-size-10"></div>
                          <div class="md-layout-item md-size-20 card-product-footer-button-area">
                            <div data-action="copy"
                                 v-show="favoriteItem.actionStatus === 2"
                                 @click="checkCopyItem(favoriteItem)"
                                 v-clipboard:copy="favoriteItem.detailUrl"
                                 v-clipboard:success="onCopy"
                                 v-clipboard:error="onCopyError">
                              复制
                            </div>
                            <!--<md-icon style="color: #ffffff">复制</md-icon>-->
                            <!--<span style="color: #ffffff; font-size: 10px;"-->
                            <!--@click="checkCopyItem(favoriteItem)"-->
                            <!--v-clipboard:copy="favoriteItem.detailUrl"-->
                            <!--v-clipboard:success="onCopy"-->
                            <!--v-clipboard:error="onCopyError">复制</span>-->
                            <!--<md-button class="md-raised" :style="buttonColorStyle(favoriteItem.color)">复制</md-button>-->
                          </div>
                        </template>
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
  import { mapState, mapMutations } from 'vuex'
  import TabCommon from './TabCommon'
  export default {
    name: 'Favorite',
    mixins: [TabCommon],
    data () {
      return {
        selectedColor: 'all',
        favoriteProductList: [],
        dataInitComplete: false,
        // favoriteList: this.$settings.getSetting('share', 'favoriteList') || []
      }
    },
    inject: ['Frame'],
    computed: {
      ...mapState('share', ['productData'])
    },
    watch: {
      favoriteProductList: {
        handler (value) {
          if (this.dataInitComplete) {
            let favoriteList = value.map(product => {
              return {
                tableName: product.tableName,
                serial: product.serial,
                color: product.color,
                favoriteOrder: product.favoriteOrder
              }
            })
            // this.$settings.setSetting('share', 'favoriteList', favoriteList)
            this.setFavoriteList(favoriteList)
            if (this.userSetting.pageSetting.autoSaveFavorite) {
              this.$settings.setSetting('share', 'favoriteList', favoriteList)
              this.$settings.saveSettings()
            }
          }
        },
        deep: true
      }
    },
    methods: {
      initFavoriteProduct () {
        this.favoriteProductList = this.productData.map(product => {
          let favoriteProduct = Object.assign({expand: false}, product, this.favoriteList.find(favorite => {
            return favorite.tableName === product.tableName && favorite.serial === product.serial
          }))
          favoriteProduct.id = `${favoriteProduct.tableName}-${favoriteProduct.serial}`
          favoriteProduct.actionStatus = 1
          return favoriteProduct
        }).filter(product => product.color).sort((product1, product2) => product1.favoriteOrder - product2.favoriteOrder)
      },
      restoreFavoriteList () {
        let frame = this
        swal({
          title: '提示!',
          text: '确认恢复收藏到上次保存的状态吗？',
          type: 'question',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }).then(({value}) => {
          if (value) {
            frame.setFavoriteList(frame.$settings.getSetting('share', 'favoriteList'))
            frame.initFavoriteProduct()
          }
        })
      },
      saveFavoriteList () {
        this.$settings.setSetting('share', 'favoriteList', this.favoriteList)
        this.$settings.saveSettings().then(response => {
          if (response.data.success) {
            swal({
              title: '提示!',
              text: '保存成功',
              type: 'success',
              confirmButtonText: '确定',
            })
          } else {
            swal({
              title: '提示!',
              text: '保存失败',
              type: 'error',
              confirmButtonText: '确定',
            })
          }
        })
      },
      initDrag () {
        this.$tableDrag.bindDrag(Array.prototype.slice.call(document.querySelectorAll('div.drag-div')),
          this.favoriteProductList, 'id',
          {
            getRowIdFunc: this.getRowKeyFunc
          }
        )
        this.dataInitComplete = true
      },
      getRowKeyFunc (element) {
        return element.dataset.index
      },
      goClassification () {
        this.Frame.goClassification()
      },
      goNew () {
        this.Frame.goNew()
      },
      getTypeIcon (favoriteProduct) {
        switch (favoriteProduct.tableName) {
          case 't_medical':
            return 'local_hospital'
          case 't_healthy':
            return 'favorite_border'
          default:
            return 'favorite_border'
        }
      },
      closeExpand (favoriteItem) {
        return () => {
          favoriteItem.expand = false
        }
      },
      iconColorStyle (color) {
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
        let colorData = this.colorList.find(item => item.colorName === color)
        return {
          'background-color': colorData.colorBk1,
          'color': '#FFFFFF'
        }
      },
      maskColorStyle (color) {
        let colorData = this.colorList.find(item => item.colorName === color)
        return {
          'background-color': colorData.colorBk1,
          'color': '#FFFFFF'
        }
      },
      infoPartClass (favoriteItem) {
        if (favoriteItem.actionStatus === 1) {
          return 'md-size-100'
        } else {
          return 'md-size-80 swipe-info-part'
        }
      },
      operationPartClass (favoriteItem) {
        if (favoriteItem.actionStatus === 1) {
          return 'md-size-hide'
        } else {
          return 'md-size-20'
        }
      },
      swipeLeft (index) {
        return () => {
          this.favoriteProductList[index].actionStatus = 2
        }
      },
      swipeRight (index) {
        return () => {
          this.favoriteProductList[index].actionStatus = 1
        }
      },
      upItem (favoriteItem, index, $event) {
        // let element = $event.srcElement || $event.target
        // this.activeUpDownIcon(element)
        let prevDisplayIndex = -1
        this.favoriteProductList.map((product, i) => {
          if (i < index && (this.selectedColor === 'all' || this.selectedColor === product.color)) {
            prevDisplayIndex = i
          }
        })
        if (prevDisplayIndex < 0) {
          return
        }
        this.changeNearPosition(prevDisplayIndex, index)
      },
      downItem (favoriteItem, index, $event) {
        let nextDisplayIndex = -1
        this.favoriteProductList.map((product, i) => {
          if (i > index && nextDisplayIndex === -1 && (this.selectedColor === 'all' || this.selectedColor === product.color)) {
            nextDisplayIndex = i
          }
        })
        if (nextDisplayIndex < 0) {
          return
        }
        this.changeNearPosition(index, nextDisplayIndex)
      },
      changeNearPosition (index1, index2) {
        let element1 = this.$refs.productCard[index1]
        let element2 = this.$refs.productCard[index2]
        let done = () => {
          element1.style.transform = ''
          element2.style.transform = ''
        }
        let [{offsetLeft: element1Left, offsetTop: element1Top, offsetHeight: element1Height},
          {offsetLeft: element2Left, offsetTop: element2Top, offsetHeight: element2Height}]
          = [element1, element2]
        Velocity(
          element1,
          {
            translateX: [0, element2Left - element1Left],
            translateY: [0, element2Top + element2Height - element1Top - element1Height],
            rotateX: [0, 180, 360, 180, 0],
            scale: [1, 0.8, 0.5, 0.8, 1]
          },
          { duration: 1000, easing: 'easeInOutCirc' }
        )
        Velocity(
          element2,
          {
            translateX: [0, element1Left - element2Left],
            translateY: [0, element1Top - element2Top],
            rotateX: [0, 180, 360, 180, 0],
            scale: [1, 0.8, 0.5, 0.8, 1]
          },
          {
            duration: 1000, easing: 'easeInOutCirc', complete: done
          }
        )
        this.swapInArray(index1, index2, this.favoriteProductList)
      },
      swapInArray (index1, index2, array) {
        if (index1 < 0 || index1 > array.length - 1) return
        if (index2 < 0 || index2 > array.length - 1) return
        let item1 = array[index1]
        item1.favoriteOrder = index2
        let item2 = array[index2]
        item2.favoriteOrder = index1
        array.splice(index1, 1, item2)
        array.splice(index2, 1, item1)
      },
      deleteItem (favoriteItem, index) {
        let frame = this
        swal({
          title: '确认删除?',
          text: `【${favoriteItem.name}】将被从您的收藏移除`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then((result) => {
          if (result.value) {
            Velocity(frame.$refs.productCard[index], {height: 0, width: 0, opacity: 0}, {duration: 500, easing: 'swing', complete: () => {
                if (index < frame.favoriteProductList.length - 1) {
                  Object.assign(frame.$refs.productCard[index].style, {height: 'auto', width: 'auto', opacity: Math.min(1, frame.favoriteProductList.length - index - 1)})
                }
                frame.$nextTick(() => {
                  frame.favoriteProductList.splice(index, 1)
                })
              }
            })
          }
        })
      },
      checkCopyItem (favoriteItem) {
        if (!favoriteItem.detailUrl) {
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
        this.$toasted.clear()
        this.$toasted.success("复制成功！", {
          icon: "mintui mintui-copy toast-icon",
          iconPack: "custom-class",
          position: "bottom-center",
          duration : 3000
        });
      },
      onCopyError (e) {
        this.$toasted.clear()
        this.$toasted.error("复制失败！", {
          icon: "mintui mintui-alert toast-icon",
          iconPack: "custom-class",
          position: "bottom-center",
          duration : 3000
        });
      },
      ...mapMutations('share', ['setFavoriteList'])
    },
    mounted () {
      this.initFavoriteProduct()
      this.$nextTick(this.initDrag)
    }
  }
</script>

<style scoped lang="scss">
  .product-card {
    width: calc(100% - 20px);
    margin: 0px 4px 24px 4px;
    display: inline-block;
    vertical-align: top;
    text-align: left;
    /*margin-bottom: 20px;*/
  }
  .favorite-content {
    padding: 30px 0px;
  }

  .favorite-url {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
    line-height: 30px;
  }

  .md-card-header-left-icon {
    text-align: right;
    margin: 0 15px;
    border-radius: 3px;
    padding: 0;
    background-color: transparent;
  }

  .card-left-icon {
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

  /**
  .card-left-icon[data-product-color="blue"] {
    -webkit-box-shadow: 0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2);
    box-shadow: 0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2);
    background: linear-gradient(60deg,#26c6da,#00acc1);
  }

  .card-left-icon[data-product-color="rose"] {
    -webkit-box-shadow: 0 12px 20px -10px rgba(233,30,99,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(233,30,99,.2);
    box-shadow: 0 12px 20px -10px rgba(233,30,99,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(233,30,99,.2);
    background: linear-gradient(60deg,#ec407a,#d81b60);
  }

  .card-left-icon[data-product-color="green"] {
    -webkit-box-shadow: 0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2);
    box-shadow: 0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2);
    background: linear-gradient(60deg,#66bb6a,#43a047);
  }

  .card-left-icon[data-product-color="yellow"] {
    -webkit-box-shadow: 0 12px 20px -10px rgba(255,152,0,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(255,152,0,.2);
    box-shadow: 0 12px 20px -10px rgba(255,152,0,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(255,152,0,.2);
    background: linear-gradient(60deg,#ffa726,#fb8c00);
  }

  .card-left-icon[data-product-color="default"] {
    -webkit-box-shadow: 0 12px 20px -10px rgba(0,0,0,0), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,0,0,0);
    box-shadow: 0 12px 20px -10px rgba(0,0,0,0), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,0,0,0);
    background: linear-gradient(60deg,#333300,#330033);
  }
  **/
  .card-product-category {
    padding-top: 10px;
    color: #999;
    font-size: 14px;
    margin: 0;
    text-align: right;
  }

  .card-product-name {
    text-decoration: none;
    color: #3c4858;
    text-align: right;
  }

  .card-product-actions {
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
  }

  .card-product-actions .actions-content {
    max-width: 100%;
    i {
      margin: auto 10px;
    }
  }

  .card-product-actions i {
    position: relative;
    top: -1px;
    font-size: 16px !important;
    color: #999;
  }

  @media screen and (min-width: 600px) and (max-width: 1200px) {
    .drag-div:hover {
      div.card-product-mask {
        display: flex;
      }
    }
  }

  .card-product-mask {
    z-index: -1;
    /*top: 0px;*/
    width: 100%;
    height: 30px;
    /*left: 0px;*/
    text-align: center;
    -webkit-box-pack: center;
    justify-content: flex-end;
    align-items: center;
    display: none;
    i {
      font-size: 20px;
      padding: 2px 10px;
      margin: 10px;
      border-radius: 15%;
    }
  }

  .card-product-color-selector {
    /*position: absolute;*/
    z-index: -1;
    /*top: 0px;*/
    /*width: calc(100% - 90px);*/
    width: available;
    height: 30px;
    /*left: 0px;*/
    text-align: center;
    -webkit-box-pack: center;
    justify-content: center;
    display: flex;
    /*border-bottom: 1px solid #ddd;*/
  }

  .card-product-color-selector span {
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

  .card-product-color-selector span.active {
    border-color: #0bf;
  }

  .card-product-delete-button-area {
    background: linear-gradient(60deg, #ec407a, #d81b60);
    display: flex;
    justify-content:center;
    align-items: center;
    /*width: 100%;*/
    /*height: 100%;*/
  }

  .card-product-footer-button-area div[data-action="copy"] {
    background: linear-gradient(60deg, #ec407a, #d81b60);
    display: flex;
    display: -webkit-flex;
    justify-content:center;
    width: 100%;
    height: 100%;
    color: #ffffff;
    font-size: 12px;
    align-items: center
  }

  .card-product-footer-button-area {
    display: flex;
    justify-content: flex-start;
  }

  .card-product-footer-button-area i[data-action="up"],
  .card-product-footer-button-area i[data-action="down"] {
    margin: 20px -10px -20px 20px;
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

  .swipe-info-part {
    padding-right: 15px;
  }

  /**
  .card-product-color-selector span[data-color="blue"] {
    background-color: #26c6da;
  }

  .card-product-color-selector span[data-color="rose"] {
    background-color: #ec407a;
  }

  .card-product-color-selector span[data-color="green"] {
    background-color: #66bb6a;
  }

  .card-product-color-selector span[data-color="yellow"] {
    background-color: #ffa726;
  }

  .card-product-color-selector span[data-color="default"] {
    background-color: #333300;
  }
  **/

</style>