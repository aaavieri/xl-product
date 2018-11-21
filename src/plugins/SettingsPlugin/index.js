const SettingsInfo = {
  settings: null,
  settingInfo: {},
  http: null,
  initData (httpPlugin, settings) {
    this.http = httpPlugin
    this.settings = settings
    this.settingInfo = JSON.parse(settings || '{}')
  },
  getSetting (pageName, keyName) {
    if (!this.settingInfo[pageName]) {
      this.settingInfo[pageName] = {}
    }
    return this.settingInfo[pageName][keyName]
  },
  setSetting (pageName, keyName, value) {
    if (!this.settingInfo[pageName]) {
      this.settingInfo[pageName] = {}
    }
    this.settingInfo[pageName][keyName] = value
    // this.saveSettings()
  },
  saveSettings () {
    this.settings = JSON.stringify(this.settingInfo)
    return this.http.post('/authApi/saveSettings', {settings: this.settings})
  },
  clearSettings () {
    this.settings = null
    this.settingInfo = {}
    return this.http.post('/authApi/clearSettings')
  }
}
const SettingsInfoPlugin = {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          settings: SettingsInfo
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$settings', {
      get () {
        return this.$root.settings
      }
    })
  }
}
export default SettingsInfoPlugin
