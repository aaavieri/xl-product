import crypto from 'crypto'

const Func = {
  dateFormat: (date, fmt) => {
    if (!date) return ''
    if (typeof date === 'number') date = new Date(date)
    let attributes = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "S": date.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (let attr in attributes)
      if (new RegExp(`(${attr})`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (attributes[attr]) : (("00" + attributes[attr]).substr(("" + attributes[attr]).length)))
      }
    return fmt
  },
  md5 (str) {
    str = str || ''
    let md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
  },
}

const FuncPlugin = {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          func: Func
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$func', {
      get () {
        return this.$root.func
      }
    })
  }
}
export default FuncPlugin