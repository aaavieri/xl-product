<template>
  <div class="frame-container">
    <md-card class="page-container no-border" :md-theme="themeName">
      <md-app md-waterfall md-mode="fixed" class="frame-app">
        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
          <div class="account-title">
            <span>个人设置【{{userName}}】</span>
          </div>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="doLogout">
              <md-icon class="mintui mintui-dengchu2" style="color: #ffffff"/>
            </md-button>
          </div>
        </md-app-toolbar>
        <md-app-content class="account-content">
          <div class="md-layout">
            <!--<div class="md-layout-item md-size-100">-->
              <!--<md-avatar class="md-large" style="border: 3px solid #ff9800;">-->
                <!--<img src="https://xiaolijiyin.com/images/logo.jpg" alt="People">-->
              <!--</md-avatar>-->
            <!--</div>-->
            <!--<md-divider/>-->
            <div class="md-layout-item md-size-100">
              <md-list class="md-line">
                <md-list-item>
                  <md-avatar style="border: 3px solid #ff9800;">
                    <img src="https://xiaolijiyin.com/images/logo.jpg" alt="People">
                  </md-avatar>
                  <div class="md-list-item-text">
                    <span>修改密码</span>
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="modifyPassword">
                    <md-icon class="mintui mintui-edit"/>
                  </md-button>
                </md-list-item>
                <md-divider/>
                <md-subheader>账户设置</md-subheader>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-save1"/>

                  <div class="md-list-item-text">
                    <span>保存用户名</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="changeSaveUserName">
                    <md-icon class="save-checkbox mintui" :class="getCheckIcon(accountSetting.saveUserName)"/>
                  </md-button>
                </md-list-item>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-save1"/>

                  <div class="md-list-item-text">
                    <span>保存密码</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="changeSavePassword">
                    <md-icon class="save-checkbox mintui" :class="getCheckIcon(accountSetting.savePassword)"/>
                  </md-button>
                </md-list-item>
                <md-divider/>

                <md-subheader>页面设置</md-subheader>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-auto"/>

                  <div class="md-list-item-text">
                    <span>自动保存收藏</span>
                    <span class="page-explain-span">全部页面</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="pageSetting.autoSaveFavorite = !pageSetting.autoSaveFavorite">
                    <md-icon class="save-checkbox mintui" :class="getCheckIcon(pageSetting.autoSaveFavorite)"/>
                  </md-button>
                </md-list-item>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-color"/>

                  <div class="md-list-item-text">
                    <span>收藏时不选颜色用默认</span>
                    <span class="page-explain-span">分类页面</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="pageSetting.defaultColorClass = !pageSetting.defaultColorClass">
                    <md-icon class="save-checkbox mintui" :class="getCheckIcon(pageSetting.defaultColorClass)"/>
                  </md-button>
                </md-list-item>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-color"/>

                  <div class="md-list-item-text">
                    <span>收藏时不选颜色用默认</span>
                    <span class="page-explain-span">最新页面</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="pageSetting.defaultColorNew = !pageSetting.defaultColorNew">
                    <md-icon class="save-checkbox mintui" :class="getCheckIcon(pageSetting.defaultColorNew)"/>
                  </md-button>
                </md-list-item>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-paixu"/>

                  <div class="md-list-item-text">
                    <span>默认排序顺序：{{pageSetting.defaultSort.sortName}}
                      <i class="md-icon md-icon-font sort-arrow-inline">{{pageSetting.defaultSort.sortIcon}}</i>
                    </span>
                    <span class="page-explain-span">最新页面</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="changeSort">
                    <md-icon class="mintui mintui-edit"/>
                  </md-button>
                </md-list-item>

                <md-list-item>
                  <md-icon class="md-primary mintui mintui-max"/>

                  <div class="md-list-item-text">
                    <span>产品最大显示数：{{pageSetting.maxDisplayNew}}</span>
                    <span class="page-explain-span">最新页面</span>
                  </div>

                  <md-button class="md-icon-button md-list-action" @click="showMaxDisplayNumber">
                    <md-icon class="mintui mintui-edit"/>
                  </md-button>
                </md-list-item>

                <md-divider/>
                <md-list-item>
                  <span @click="cancelSetting" class="account-md-list-button md-list-button-cancel">取消修改</span>
                </md-list-item>
                <md-list-item>
                  <span @click="saveSetting" class="account-md-list-button md-list-button-save">保存修改</span>
                </md-list-item>
              </md-list>
            </div>
          </div>
        </md-app-content>
      </md-app>
    </md-card>
    <md-dialog style="width: 280px; height: 200px" :md-active.sync="showSortSelector">
      <md-dialog-title>选择默认排序顺序</md-dialog-title>
      <div class="setting-sort-selector" v-for="sortType in sortTypeList" :key="sortType.sortKey">
        <span>
          {{sortType.sortName}}
          <i class="md-icon md-icon-font md-elevation-20"
             :class="{'active': sortType.sortKey === pageSetting.defaultSort.sortKey && sortOrder.sortValue === pageSetting.defaultSort.sortValue}"
             :key="sortType.sortKey + sortOrder.sortValue"
             @click="setDefaultSort(sortType, sortOrder)"
             v-for="sortOrder in sortOrderList">
            {{sortOrder.sortIcon}}
          </i>
        </span>
      </div>
    </md-dialog>
  </div>
</template>

<script>
import TabCommon from './TabCommon'
import {mapMutations} from 'vuex'

export default {
  name: 'Account',
  mixins: [TabCommon],
  inject: ['Frame'],
  data () {
    return {
      accountSetting: {},
      pageSetting: {},
      showSortSelector: false
    }
  },
  computed: {
    userName () {
      return this.Frame.getUserName()
    }
  },
  methods: {
    getCheckIcon (flag) {
      return flag ? 'mintui-weibiaoti-' : 'mintui-zhengfangxing'
    },
    modifyPassword () {
      let frame = this
      swal({
        title: '修改密码',
        html:
          `<label for="passwordInput">现密码</label>
           <input id='passwordInput'  placeholder='请输入密码' class='swal2-input' value='' type='password'>
           <label for="newPasswordInput">新密码</label>
           <input id='newPasswordInput'  placeholder='请输入新密码' class='swal2-input' value='' type='password'>
           <label for="confirmPasswordInput">确认新密码</label>
           <input id='confirmPasswordInput'  placeholder='确认新密码' class='swal2-input' value='' type='password'>`,
        showCancelButton: true,
        focusConfirm: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        preConfirm: () => {
          return new Promise(((resolve) => {
            let password = document.getElementById('passwordInput').value
            if (password.trim() === '') {
              document.getElementById('passwordInput').focus()
              throw new Error('请输入现密码')
            }
            let newPassword = document.getElementById('newPasswordInput').value
            if (newPassword.trim() === '') {
              document.getElementById('newPasswordInput').focus()
              throw new Error('请输入新密码')
            }
            if (newPassword.trim().length < 6) {
              document.getElementById('newPasswordInput').focus()
              document.getElementById('newPasswordInput').value = ''
              throw new Error('请输入6位及其以上的密码')
            }
            if (newPassword === password) {
              document.getElementById('newPasswordInput').focus()
              document.getElementById('newPasswordInput').value = ''
              throw new Error('新密码不能和现密码一样')
            }
            let confirmPassword = document.getElementById('confirmPasswordInput').value
            if (confirmPassword.trim() === '') {
              document.getElementById('confirmPasswordInput').focus()
              throw new Error('请再输入一次新密码')
            }
            if (newPassword !== confirmPassword) {
              document.getElementById('confirmPasswordInput').focus()
              document.getElementById('confirmPasswordInput').value = ''
              throw new Error('两次新密码不一致')
            }
            resolve([password, newPassword])
          })).catch(error => {
            swal.showValidationMessage(error)
          })
        }
      }).then(({value}) => {
        if (!value) {
          return
        }
        let password = frame.$func.md5(value[0])
        let newPassword = frame.$func.md5(value[1])
        frame.$http.post('/users/modifyPassword', {password, newPassword}).then(response => {
          if (response.data.success) {
            frame.$toasted.success('修改成功', {position: "bottom-center", duration : 3000})
          } else {
            frame.$toasted.error('修改失败', {position: "bottom-center", duration : 3000})
          }
        }).catch(error => {
          frame.$toasted.error('修改失败', {position: "bottom-center", duration : 3000})
        })
      })
    },
    changeSort () {
      this.showSortSelector = true
    },
    changeSaveUserName () {
      this.accountSetting.saveUserName = !this.accountSetting.saveUserName
      if (!this.accountSetting.saveUserName) {
        this.accountSetting.savePassword = false
      }
    },
    changeSavePassword () {
      if (!this.accountSetting.saveUserName && !this.accountSetting.savePassword) {
        swal({
          title: '错误!',
          text: '若要保存密码必须也保存用户名',
          type: 'error',
          confirmButtonText: '确定'
        })
        return
      }
      let promise = Promise.resolve({value: true})
      if (!this.accountSetting.savePassword) {
        promise = swal({
          title: '提示!',
          text: '保存密码之后将会自动登录，确定要继续吗？',
          type: 'question',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        })
      }
      promise.then(({value}) => {
        if (value) {
          this.accountSetting.savePassword = !this.accountSetting.savePassword
        }
      })
    },
    setDefaultSort (sortType, sortOrder) {
      this.pageSetting.defaultSort = Object.assign({}, sortType, sortOrder)
    },
    showMaxDisplayNumber () {
      let frame = this
      swal({
        title: '修改产品最大显示数',
        html:
          `<label for="maxDisplayInput">最大显示数（仅限数字）</label>
           <input id='maxDisplayInput' style="max-width: 100%" placeholder='请输入最大显示数' type="number" class='swal2-input'
            value='${this.pageSetting.maxDisplayNew}'>`,
        showCancelButton: true,
        focusConfirm: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        preConfirm: () => {
          return new Promise(((resolve) => {
            let maxDisplay = document.getElementById('maxDisplayInput').value
            if (maxDisplay.trim() === '') {
              document.getElementById('maxDisplayInput').focus()
              throw new Error('您的输入为空')
            }
            let intMaxDisplay = parseInt(maxDisplay)
            if (intMaxDisplay !== parseFloat(maxDisplay)) {
              document.getElementById('maxDisplayInput').focus()
              document.getElementById('maxDisplayInput').value = ''
              throw new Error('请输入正整数')
            }
            if (intMaxDisplay <= 0) {
              document.getElementById('maxDisplayInput').focus()
              document.getElementById('maxDisplayInput').value = ''
              throw new Error('请输入正整数')
            }
            resolve(intMaxDisplay)
          })).catch(error => {
            swal.showValidationMessage(error)
          })
        }
      }).then(({value}) => {
        if (!value) {
          return
        }
        frame.pageSetting.maxDisplayNew = value
      })
    },
    cancelSetting () {
      let frame = this
      swal({
        title: '提示!',
        text: '确认取消所有修改吗？',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(({value}) => {
        if (value) {
          Object.assign(frame.accountSetting, frame.userSetting.accountSetting)
          Object.assign(frame.pageSetting, frame.userSetting.pageSetting)
        }
      })
    },
    saveSetting () {
      let frame = this
      swal({
        title: '提示!',
        text: '确认保存所有修改吗？',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(({value}) => {
        if (value) {
          frame.$settings.setSetting('share', 'accountSetting', frame.accountSetting)
          frame.$settings.setSetting('share', 'pageSetting', frame.pageSetting)
          return frame.$settings.saveSettings()
        } else {
          return Promise.resolve({dismiss: true})
        }
      }).then(response => {
        if (response.dismiss) {
          return
        }
        if (response.data.success) {
          swal({
            title: '提示!',
            text: '保存成功',
            type: 'success',
            confirmButtonText: '确定',
          })
          frame.setDbSetting({
            accountSetting: frame.accountSetting,
            pageSetting: frame.pageSetting
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
    doLogout () {
      let msg = '您确定要退出登录吗？'
      if (this.accountSetting.savePassword) {
        msg = '退出登录后您保存的密码也将不再保存，是否退出？'
      }
      let frame = this
      swal({
        title: '提示!',
        text: msg,
        type: 'question',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(({value}) => {
        if (value) {
          window.localStorage.removeItem('shareFramePassword')
          frame.$http.post('/users/logout').then(response => {
            if (response.data.success) {
              swal({
                title: '提示!',
                text: '成功退出',
                type: 'success',
                confirmButtonText: '确定',
                timer: 2000
              }).then(() => {
                frame.goLogin()
              })
            } else {
              throw new Error('退出失败')
            }
          }).catch(() => {
            swal({
              title: '提示!',
              text: '退出失败',
              type: 'error',
              confirmButtonText: '确定'
            })
          })
        }
      })
    },
    ...mapMutations('share', ['setDbSetting', 'goLogin'])
  },
  created () {
    this.accountSetting = Object.assign({}, this.userSetting.accountSetting)
    this.pageSetting = Object.assign({}, this.userSetting.pageSetting)
  }
}
</script>

<style scoped lang="scss">
  .account-content {
    padding: 10px 0px;
  }

  .account-title {
    width: calc(100% - 80px);
    margin-left: 40px;
    height: 50px;
    /*left: 0px;*/
    text-align: center;
    -webkit-box-pack: center;
    justify-content: center;
    display: flex;
    color: #ffffff;
    span {
      display: flex;
      font-size: 18px;
      justify-content: center;
      align-items: Center;
      margin: auto 10px;
    }
  }

  .save-checkbox {
    width: 20px;
    height: 20px;
    font-size: 20px!important;
    min-width: 20px;
    max-width: 20px;
    min-height: 20px;
    max-height: 20px;
  }

  .page-explain-span {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.54);
  }

  .sort-arrow-inline {
    color: #ff9800;
    width: 20px;
    max-width: 20px;
    min-width: 20px;
    height: 20px;
    font-size: 20px!important;
  }

  .setting-sort-selector {
    width: 100%;
    height: 50px;
    /*left: 0px;*/
    text-align: center;
    -webkit-box-pack: center;
    justify-content: center;
    display: flex;
    /*color: #ffffff;*/
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

  .account-md-list-button {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    line-height: 40px;
    border-radius: 20px;
    color: #ffffff;
  }
  .md-list-button-cancel {
    background: linear-gradient(60deg, #ef5350, #e53935);
    box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  }
  .md-list-button-cancel:active {
    background: linear-gradient(60deg, #ffffff, #ffffff);
    color: #1b1e21;
    line-height: 34px;
    border: 3px solid #ef5350;
  }
  .md-list-button-save {
    background: linear-gradient(60deg, #3eda27, #199f6b);
    box-shadow: 0 12px 20px -10px rgba(255, 152, 0, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(255, 152, 0, 0.2);
  }
  .md-list-button-save:active {
    background: linear-gradient(60deg, #ffffff, #ffffff);
    color: #1b1e21;
    line-height: 34px;
    border: 3px solid #3eda27;
  }
</style>