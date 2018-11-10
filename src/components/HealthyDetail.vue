<template>
  <transition
    enter-active-class="animated flipInY"
    leave-active-class="animated flipOutY"
    v-on:after-enter="loaded"
    v-on:after-leave="unloaded">
    <md-card class="page-container no-border" :md-theme="themeName" v-show="startPageAnimate">
      <md-app md-waterfall md-mode="fixed" class="shape-app">
        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon md-src="./static/svg/icon-menu.svg"/>
          </md-button>
          <span class="md-title my-title">{{rowData.name}}</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="goBack()">
              <md-icon md-src="./static/svg/icon-return.svg"/>
            </md-button>
          </div>
        </md-app-toolbar>

        <md-app-drawer class="my-drawer" md-permanent="clipped" :md-active.sync="menuVisible">

          <md-list class="my-drawer-list">
            <md-list-item class="my-drawer-item" v-for="info in healthyData"
              @click="goCard(info.id)" :key="info.index">
              <md-icon :md-src="info.iconSrc"/>
              <span class="md-list-item-text my-drawer-span">{{info.name}}</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>

        <md-app-content style="overflow-x: hidden">
          <transition
            v-for="info in healthyData"
            :key="info.id"
            v-bind:css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter">
          <md-card class="info-card md-elevation-20" style="left: -500px" md-with-hover
             :style="cardColorStyle(info.index)" :id="info.id" v-show="startAnimate" :data-index="info.index">
            <md-ripple>
              <md-card-area md-inset>
                <md-card-header class="without-subhead">
                  <div class="md-title">{{info.name}}</div>
                </md-card-header>
              </md-card-area>
              <md-card-content class="card-without-subhead">
                <div class="card-reservation" v-for="field in info.fieldArray" :key="field.fieldName">
                  <md-icon md-src="./static/svg/icon-healthy-attr.svg" class="item-icon">属性</md-icon>
                  <span class="item-detail">{{field.fieldLabel}}：<br/>{{field.fieldValue}}</span>
                </div>
              </md-card-content>
            </md-ripple>
          </md-card>
          </transition>
          <div style="height: 0; width: 100%" id="bottomDiv" ></div>
        </md-app-content>
      </md-app>
      <md-speed-dial class="md-bottom-right" mdEvent="click">
        <md-speed-dial-target>
          <md-icon md-src="./static/svg/icon-plus.svg" class="md-morph-initial">功能</md-icon>
          <md-icon md-src="./static/svg/icon-close.svg" class="md-morph-final">收起</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content>
          <md-button class="md-icon-button" @click="goTop()">
            <md-icon md-src="./static/svg/icon-up-black2.svg">顶部</md-icon>
          </md-button>

          <md-button class="md-icon-button" @click="goBottom()">
            <md-icon md-src="./static/svg/icon-down-black2.svg">底部</md-icon>
          </md-button>
        </md-speed-dial-content>
      </md-speed-dial>
      <transition
        enter-active-class="animated slideInRight">
        <floating-menu v-show="floatingMenuVisible" :active.sync="floatinMenuActive">
          <md-list class="md-dense">
            <md-list-item>
              <md-avatar class="md-primary md-small">
              </md-avatar>
              <span class="md-list-item-text my-drawer-span">快速跳转</span>
            </md-list-item>
            <md-divider></md-divider>
            <transition
              v-for="info in healthyData"
              enter-active-class="animated rollIn"
              :key="info.index">
              <md-list-item @click.stop="goCard(info.id)" v-show="floatinMenuActive">
                <!--<md-icon md-dense :md-src="info.iconSrc"/>-->
                <md-avatar class="md-avatar-icon md-small md-accent">
                  {{getAvatarChar(info)}}
                </md-avatar>
                <span class="md-list-item-text my-drawer-span">{{info.name}}</span>
              </md-list-item>
            </transition>
          </md-list>
        </floating-menu>
      </transition>
    </md-card>
  </transition>
</template>

<script>
import Velocity from 'velocity-animate'
import { mapMutations } from 'vuex'
import FloatingMenu from './FloatingMenu'
const cardColorArr = ['orange', '#e01919', 'brown', '#2aa0a0', 'purple', 'indigo', 'teal', 'green', '#63d063']
export default {
  name: 'HealthyDetail',
  components: {
    FloatingMenu
  },
  data () {
    return {
      healthyData: [],
      menuVisible: false,
      startAnimate: true,
      floatingMenuVisible: false,
      floatinMenuActive: false,
      startPageAnimate: false,
      structureMap: [
        {
          id: 'basicInfo',
          name: '基本信息',
          iconSrc: './static/svg/icon-info.svg',
          index: 1,
          fieldArray: [
            {
              fieldName: 'serial',
              fieldLabel: '项目编号',
              fieldIndex: 1
            },
            {
              fieldName: 'name',
              fieldLabel: '项目名称',
              fieldIndex: 2
            }
          ]
        },
        {
          id: 'testInfo',
          name: '检测信息',
          iconSrc: './static/svg/icon-test.svg',
          index: 2,
          fieldArray: [
            {
              fieldName: 'testMethod',
              fieldLabel: '检测方法',
              fieldIndex: 1
            },
            {
              fieldName: 'sampleRequirement',
              fieldLabel: '样本要求',
              fieldIndex: 2
            },
            {
              fieldName: 'sampleTransportCondition',
              fieldLabel: '样本运输条件',
              fieldIndex: 3
            },
            {
              fieldName: 'testCycle',
              fieldLabel: '检测周期(工作日)',
              fieldIndex: 4
            },
            {
              fieldName: 'laboratory',
              fieldLabel: '实验室',
              fieldIndex: 5
            }
          ]
        },
        {
          id: 'priceInfo',
          name: '资费信息',
          iconSrc: './static/svg/icon-price.svg',
          index: 3,
          fieldArray: [
            {
              fieldName: 'standardCharge',
              fieldLabel: '标准收费/人次',
              fieldIndex: 1
            },
            {
              fieldName: 'agentPrice',
              fieldLabel: '代理价',
              fieldIndex: 3
            }
          ]
        },
        {
          id: 'otherInfo',
          name: '其它信息',
          iconSrc: './static/svg/icon-other.svg',
          index: 4,
          fieldArray: [
            {
              fieldName: 'testIndex',
              fieldLabel: '检测指标及临床意义',
              fieldIndex: 1
            }
          ]
        }
      ]
    }
  },
  methods: {
    initHealthyDetail () {
      var originalHealthyData = this.getOriginalHealthyData()
      this.healthyData = this.structureMap.sort((i1, i2) => i1.index - i2.index).map(info => {
        info.fieldArray.sort((f1, f2) => f1.fieldIndex - f2.fieldIndex).map(field => {
          // field.fieldValue = originalHealthyData[field.fieldName]
          this.$set(field, 'fieldValue', originalHealthyData[field.fieldName])
          return field
        })
        return info
      })
    },
    getOriginalHealthyData () {
      let healthyDetail = this
      var healthyData = Object.assign({}, this.rowData)
      Object.keys(healthyData).map(key => {
        var columnInfo = healthyDetail.$columnInfo.getColumn('t_medical', key)
        if (columnInfo && columnInfo.dataType === 'dictionary') {
          healthyData[key] = healthyDetail.$dictionary.getName('t_medical', key, healthyData[key])
        }
      })
      if (healthyData.testCycleMin !== healthyData.testCycleMax) {
        healthyData.testCycle = `${healthyData.testCycleMin}-${healthyData.testCycleMax}`
      } else {
        healthyData.testCycle = `${healthyData.testCycleMin}`
      }
      return healthyData
      // return {
      //   serial: 'FE001',
      //   name: '染色体异常基因检测',
      //   testMethod: 'NGS',
      //   sampleRequirement: '外周血',
      //   sampleTransportCondition: '4度冷藏',
      //   testCycle: '10—15',
      //   standardCharge: 2400,
      //   agentQuotation: 900,
      //   agentPrice: '5-10例：返50；10例以上：返100',
      //   costPrice: '750',
      //   testIndex: '23对染色体非整倍体、300多种常见染色体微缺失/微重复综合征及其他100kb以上的染色体异常',
      //   laboratory: '东莞博奥'
      // }
    },
    goBack () {
      this.startPageAnimate = false
    },
    goCard (id) {
      this.goComponent('#' + id)
      this.menuVisible = false
    },
    goTop () {
      this.goComponent('.md-app-content')
    },
    goBottom () {
      this.goComponent('#bottomDiv')
    },
    goComponent (selector) {
      // 不把md-app-content的overflow-x:hidden去掉的话就滚不动，我也不知道为什么
      this.$el.querySelector('div.md-app-content').style = ''
      var component = this.$el.querySelector(selector)
      var app = this.$el.querySelector('div.md-app-scroller')
      if (component) Velocity(component, 'scroll', { container: (app || document.body), duration: 700 })
    },
    cardColorStyle: (i) => {
      return {
        backgroundColor: cardColorArr[i],
        color: '#fff'
      }
    },
    generateCardColor () {
      var len = cardColorArr.length
      for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i))
        var temp = cardColorArr[index]
        cardColorArr[index] = cardColorArr[len - i - 1]
        cardColorArr[len - i - 1] = temp
      }
    },
    getAvatarChar: info => info.name.substring(0, 1),
    showFloatingMenu () {
      this.floatingMenuVisible = true
    },

    // animate
    loaded: function (el) {
      this.startAnimate = true
    },
    unloaded: function (el) {
      // 这两种写法是等价的
      // this.$store.commit('select', 'healthy')
      this.select('healthy')
      this.$router.go(-1)
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var realHeight = el.offsetHeight
      el.style.width = '0%'
      el.style.height = '0px'

      var top = Math.round(Math.random() * 1000) - 500
      var left = Math.round(Math.random() * 1000) - 500
      el.style.top = top
      el.style.left = left
      Velocity(
        el,
        { top: top, left: left },
        { complete: done, duration: 0 }
      )
      var component = this
      setTimeout(() => {
        Velocity(el,
          { opacity: 1, height: realHeight, width: '100%', top: 'auto', left: 'auto' },
          {
            complete: () => {
              done()
              component.goCard(el.id)
              if (el.dataset.index === component.healthyData.length.toString()) {
                component.showFloatingMenu()
              }
            },
            duration: 1000
          }
        )
      }, (el.dataset.index - 1) * 1000)
    },
    // leave: function (el, done) {
    // },

    // vuex store
    ...mapMutations('tab', ['select'])
  },
  props: {
    themeName: {
      type: String,
      default: 'default'
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.initHealthyDetail()
    this.generateCardColor()
    this.startAnimate = false
    this.startPageAnimate = true
    // var healthyDetail = this
    // setTimeout(() => {
    //   healthyDetail.startAnimate = true
    // }, 10)
  }
}
</script>

<style scoped>
  .my-title {
    max-width: 60vw;
    font-size: 16px;
  }
  .my-toolbar {
    font-size: 16px;
    /*color: white!important;*/
  }
  .my-drawer {
    margin-top: 0px;
    /*background-color: #191919;*/
  }
  .my-drawer-list {
    /*padding: 0px;*/
    /*margin-top: 4px;*/
    /*background-color: #191919;*/
  }
  .my-drawer-item {
    /*background-color: #e91e63;*/
    /*background-color: brown;*/
    /*margin: 0px 10px 12px;*/
    /*border-radius: 10px;*/
  }
  .my-drawer-span {
    color: #191919;
  }
  .without-subhead {
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
  .item-icon {
    margin-right: 32px;
    margin-top: 5px;
    margin-bottom: 0px;
    align-self: flex-start;
  }
  .item-detail {
    flex: 1;
    align-self: auto;
    vertical-align: middle;
    height: 100%;
    width: 100%;
    display:inline-block;
    /*white-space: pre-wrap;*/
  }
  .card-reservation {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info-card {
    width: 100%;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
    text-align: left;
  }
  .shape-app {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border: 0px;
    border-radius: 0px;
  }
  .md-app {
    min-height: 100vh;
    max-height: 100vh;
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
