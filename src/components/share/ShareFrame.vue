<template>
  <div>
    <div class="mask" v-if="step === 1">
    </div>
    <div class="mask" v-else-if="step === 2">
      <md-progress-spinner :md-diameter="70" :md-stroke="7" md-mode="indeterminate"/>
    </div>
    <div class="frame-container frame-self" v-else-if="step === 3">
      <!--<medical :medicalData="medicalData" :selectedTabData="selected"></medical>-->
      <transition enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                  :duration="300">
        <component :is="selected.compName" :theme-name="selected.themeName">
        </component>
      </transition>
      <md-card class="tabbar-container">
        <md-bottom-bar md-type="fixed"
                       :class="selected.themeName + '-bottom-bar'"
                       class="share-bottom-bar md-primary md-elevation-20 radius-shape-div"
                       :md-active-item="selectedTabId">
          <md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"
                              :key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"
                              @click="clickBottomBar(item)"/>
        </md-bottom-bar>
      </md-card>
    </div>
  </div>
</template>

<script>
import Account from './Account'
import Favorite from './Favorite'
import New from './New'
import Classification from './Classification'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'ShareFrame',
  components: {
    Account,
    Favorite,
    New,
    Classification
  },
  data () {
    return {
      loginData: {
        userName: '',
        password: '',
        savePassword: '',
        isLogging: false,
        autoLogging: false
      },
      selected: {},
      tabList: [
        {
          id: 1,
          name: '收藏',
          compName: 'Favorite',
          themeName: 'purple-custom',
          imgSrc: 'favorite_border'
        },
        {
          id: 2,
          name: '分类',
          compName: 'Classification',
          themeName: 'default',
          imgSrc: 'class'
        },
        {
          id: 3,
          name: '最新',
          compName: 'New',
          themeName: 'green-custom',
          imgSrc: 'fiber_new'
        },
        {
          id: 4,
          name: '设置',
          compName: 'Account',
          themeName: 'orange-custom',
          imgSrc: 'account_box'
        }
      ]
    }
  },
  provide () {
    return {
      Frame: {
        goFavorite: this.goFavorite,
        goClassification: this.goClassification,
        goNew: this.goNew,
        goAccount: this.goAccount,
        getUserName: this.getUserName
      }
    }
  },
  methods: {
    initLogin () {
      let frame = this
      swal({
        title: '用户验证',
        html:
        `<input id='userNameInput' placeholder='请输入用户' class='swal2-input' value='${frame.loginData.userName}'>
        <input id='passwordInput'  placeholder='请输入密码' class='swal2-input' value='${frame.loginData.password}' type='password'>`,
        focusConfirm: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: true,
        confirmButtonText: '验证',
        preConfirm: () => {
          return new Promise(((resolve) => {
            let userName = document.getElementById('userNameInput').value
            if (userName.trim() === '') {
              document.getElementById('userNameInput').focus()
              throw new Error('请输入用户名')
            }
            let password = document.getElementById('passwordInput').value
            if (password.trim() === '') {
              document.getElementById('passwordInput').focus()
              throw new Error('请输入密码')
            }
            resolve([userName, password])
          })).catch(error => {
            swal.showValidationMessage(error)
          })
        }
      }).then(({value}) => {
        frame.loginData.userName = value[0]
        frame.loginData.password = value[1]
        frame.doLogin()
      })
    },
    doLogin () {
      if (this.loginData.isLogging) {
        return
      }
      let password = this.$func.md5(this.loginData.password);

      if (this.loginData.autoLogging) {
        password = window.localStorage.getItem('shareFramePassword')
      }

      //设置在登录状态
      this.loginData.isLogging = true;

      let frame = this

      this.$http.post('/users/login', {
        userId: this.loginData.userName,
        password
      }).then(response => {
        frame.loginData.isLogging = false
        if (response.data.success) {
          // this.$router.push('/showGlitch')
          // if (window.localStorage.getItem('shareSaveUserNameFlag') === 'true') {
          //   window.localStorage.setItem('shareFrameUserName', frame.loginData.userName)
          // }
          // if (window.localStorage.getItem('shareSavePasswordFlag') === 'true') {
          //   window.localStorage.setItem('shareFramePassword', password)
          // }
          if (frame.loginData.autoLogging) {
            swal({
              title: '操作成功!',
              text: '自动登录成功',
              type: 'success',
              confirmButtonText: 'OK',
              timer: 2000
            })
          }
          this.loginData.savePassword = password
          frame.saveUserNameToStorage()
          frame.savePasswordToStorage()
          frame.goNextStep()
        } else {
          this.loginData.autoLogging = false
          throw new Error(response.data.errMsg)
        }
      }).catch((errMsg) => {
        this.loginData.autoLogging = false
        frame.loginData.isLogging = false
        swal({
          title: '登录失败!',
          text: errMsg || '未知错误',
          type: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          frame.loginData.password = ''
          frame.initLogin()
        })
      })
    },
    goFavorite () {
      this.clickBottomBar(this.tabList[0])
    },
    goClassification () {
      this.clickBottomBar(this.tabList[1])
    },
    goNew () {
      this.clickBottomBar(this.tabList[2])
    },
    goAccount () {
      this.clickBottomBar(this.tabList[3])
    },
    getUserName () {
      return this.loginData.userName
    },
    clickBottomBar (item) {
      // 这两行的写法是一样的
      // this.$store.commit('selectTab', item.id)
      this.selectTab(item.id)
    },
    initData () {
      if (this.productDataInit) {
        this.completeLoad()
        return
      }
      this.$dictionary.initData(this.$http)
      this.$columnInfo.initData(this.$http)
      let frame = this
      this.$http.get('/authApi/getShareData').then(response => {
        if (response.data.success) {
          frame.initProductData(response.data.data.productData)
          frame.initSetting(response.data.data.userSettings)
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
    initSetting (userSettings) {
      this.$settings.initData(this.$http, userSettings)
      this.setDbSetting({
        accountSetting: this.$settings.getSetting('share', 'accountSetting'),
        pageSetting: this.$settings.getSetting('share', 'pageSetting')
      })
      this.setFavoriteList(this.$settings.getSetting('share', 'favoriteList'))
    },
    completeLoad () {
      let frame = this
      let checkInitComplete = setInterval(() => {
        if (frame.$dictionary.inited && frame.$columnInfo.inited) {
          frame.goNextStep()
          // let selectedTab = frame.selectedTab || frame.tabList[0].id
          frame.selected = frame.tabList.find(tab => tab.id === (frame.selectedTabId || 1))
          clearInterval(checkInitComplete)
        }
      }, 100)
    },
    saveUserNameToStorage () {
      if (window.localStorage.getItem('shareSaveUserNameFlag') === 'true') {
        window.localStorage.setItem('shareFrameUserName', this.loginData.userName)
      } else {
        window.localStorage.removeItem('shareFrameUserName')
      }
    },
    savePasswordToStorage () {
      if (window.localStorage.getItem('shareSavePasswordFlag') === 'true') {
        window.localStorage.setItem('shareFramePassword', this.loginData.savePassword)
      } else {
        window.localStorage.removeItem('shareFramePassword')
      }
    },

    // 下面一行是使用SimpleEventHub和MultiModuleEventHub的写法
    // ...mapMutations(['select'])
    // 下面两行是使用NamespaceEventHub的写法
    // ...mapMutations(['tab/select'])
    ...mapMutations('share', ['selectTab', 'initProductData', 'goNextStep', 'goLogin', 'goStep', 'setDbSetting', 'setFavoriteList'])
  },
  computed: {
    // 下面一行是使用SimpleEventHub和的写法
    // ...mapState(['selectedTab'])
    // 下面一行是使用MultiModuleEventHub和NamespaceEventHub都能用的写法
    // ...mapState({ selectedTab: state => state.tab.selectedTab })
    // 下面一行是使用NamespaceEventHub专用的写法
    userSettingSaveUserName () {
      return this.userSetting.accountSetting.saveUserName
    },
    userSettingSavePassword () {
      return this.userSetting.accountSetting.savePassword
    },
    ...mapState('share', {
      selectedTabId: state => state.selectedTabId,
      step: state => state.step,
      productDataInit: state => state.productDataInit,
      productData: state => state.productData
    }),
    ...mapGetters('share', ['userSetting'])
  },
  watch: {
    selectedTabId (val) {
      this.selected = this.tabList.find(tab => tab.id === val)
    },
    step (val) {
      if (val === 2) {
        this.initData()
      } else if (val === 3) {
        this.selectTab(this.selectedTabId || 1)
      }
    },
    userSettingSaveUserName: {
      handler (value) {
        if (!this.productDataInit) {
          return
        }
        window.localStorage.setItem('shareSaveUserNameFlag', value)
        this.saveUserNameToStorage()
      },
      immediate: true
    },
    userSettingSavePassword: {
      handler (value) {
        if (!this.productDataInit) {
          return
        }
        window.localStorage.setItem('shareSavePasswordFlag', value)
        this.savePasswordToStorage()
      },
      immediate: true
    }
  },
  created () {
    if (window.localStorage.getItem('shareSaveUserNameFlag') === 'true') {
      this.loginData.userName = window.localStorage.getItem('shareFrameUserName')
    }
  },
  mounted () {
    if (this.step === 3) {
      // this.selected = this.tabList.find(item => item.id === (this.selectedTabId || 1))
      // TODO
      // this.initData()
      this.goStep(2)
    } else if (this.step === 1) {
      if (window.localStorage.getItem('shareSavePasswordFlag') !== 'true') {
        this.loginData.autoLogging = false
        this.initLogin()
      } else {
        this.loginData.autoLogging = true
        this.doLogin()
      }
    }
    // if (this.$dictionary.inited && this.$columnInfo.inited) {
    //   var selectedTab = this.selectedTab || this.tabList[0].id
    //   this.selected = this.tabList.find(tab => tab.id === selectedTab)
    // }
    // this.$dictionary.initData(this.$http)
    // this.$columnInfo.initData(this.$http)
    // this.initData()
  }
}
</script>

<style scoped>
  .green-custom-bottom-bar {
    background-color: var(--md-theme-green-custom-primary, #448aff)!important;
  }
  .purple-custom-bottom-bar {
    background-color: var(--md-theme-purple-custom-primary, #448aff)!important;
  }
  .orange-custom-bottom-bar {
    background-color: var(--md-theme-orange-custom-primary, #448aff)!important;
  }
  .pink-custom-bottom-bar {
    background-color: var(--md-theme-pink-custom-primary, #448aff)!important;
  }
  .brown-custom-bottom-bar {
    background-color: var(--md-theme-brown-custom-primary, #448aff)!important;
  }
  .default-bottom-bar {
    background-color: var(--md-theme-default-primary, #448aff)!important;
  }
</style>
