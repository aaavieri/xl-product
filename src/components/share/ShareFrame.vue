<template>
  <div>
    <div class="mask" v-if="step === 1">
    </div>
    <div class="mask" v-else-if="step === 2">
      <md-progress-spinner :md-diameter="70" :md-stroke="7" md-mode="indeterminate"/>
    </div>
    <div class="frame-container frame-self" v-else-if="step === 3">
      <!--<medical :medicalData="medicalData" :selectedTabData="selected"></medical>-->
      <component :is="selected.compName">
      </component>
      <md-card class="tabbar-container">
        <md-bottom-bar md-type="fixed" class="my-bottom-bar md-primary md-elevation-20 radius-shape-div" :md-active-item="selectedTabId">
          <md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"
                              :key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"
                              @click="clickBottomBar(item)"/>
        </md-bottom-bar>
      </md-card>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto'
import Account from './Account'
import Favorite from './Favorite'
import New from './New'
import Classification from './Classification'
import { mapState, mapMutations } from 'vuex'

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
        userName: window.localStorage.shareFrameUserName || '',
        password: '',
        isLogging: false
      },
      selected: {},
      tabList: [
        {
          id: 1,
          name: '收藏',
          compName: 'Favorite',
          imgSrc: 'favorite_border'
        },
        {
          id: 2,
          name: '分类',
          compName: 'Classification',
          imgSrc: 'class'
        },
        {
          id: 3,
          name: '最新',
          compName: 'New',
          imgSrc: 'fiber_new'
        },
        {
          id: 4,
          name: '设置',
          compName: 'Account',
          imgSrc: 'account_box'
        }
      ]
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
        focusConfirm: false,
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
      let password = this.md5(this.loginData.password);

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
          window.localStorage.shareFrameUserName = frame.loginData.userName
          frame.goNextStep()
        } else {
          throw new Error(response.data.errMsg)
        }
      }).catch((errMsg) => {
        frame.loginData.isLogging = false
        swal({
          title: '登录失败!',
          text: errMsg || '未知错误',
          type: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          frame.loginData.password = ''
          frame.initLogin()
        })
      })
    },
    md5 (str) {
      str = str || ''
      let md5sum = crypto.createHash('md5');
      md5sum.update(str);
      str = md5sum.digest('hex');
      return str;
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
          frame.$settings.initData(frame.$http, response.data.data.settings)
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
      let checkInitComplete = setInterval(() => {
        if (frame.$dictionary.inited && frame.$columnInfo.inited) {
          frame.goNextStep()
          // let selectedTab = frame.selectedTab || frame.tabList[0].id
          frame.selected = frame.tabList.find(tab => tab.id === (frame.selectedTabId || 1))
          clearInterval(checkInitComplete)
        }
      }, 100)
    },
    // 下面一行是使用SimpleEventHub和MultiModuleEventHub的写法
    // ...mapMutations(['select'])
    // 下面两行是使用NamespaceEventHub的写法
    // ...mapMutations(['tab/select'])
    ...mapMutations('share', ['selectTab', 'initProductData', 'goNextStep', 'goLogin', 'goStep'])
  },
  computed: {
    // 下面一行是使用SimpleEventHub和的写法
    // ...mapState(['selectedTab'])
    // 下面一行是使用MultiModuleEventHub和NamespaceEventHub都能用的写法
    // ...mapState({ selectedTab: state => state.tab.selectedTab })
    // 下面一行是使用NamespaceEventHub专用的写法
    ...mapState('share', {
      selectedTabId: state => state.selectedTabId,
      step: state => state.step,
      productDataInit: state => state.productDataInit,
      productData: state => state.productData
    })
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
    }
  },
  mounted () {
    if (this.step === 3) {
      // this.selected = this.tabList.find(item => item.id === (this.selectedTabId || 1))
      // TODO
      // this.initData()
      this.goStep(2)
    } else if (this.step === 1) {
      this.initLogin()
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
