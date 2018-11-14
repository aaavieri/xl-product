<template>
  <div class="notifications my-elevation-20">
    <!--<transition name="list" mode="in-out">-->
    <transition enter-active-class="animated zoomInUp"
                leave-active-class="animated zoomOutDown"
                mode="in-out">
      <!--<notification-->
      <!--v-for="notification in notifications"-->
      <!--v-bind="notification"-->
      <!--:clickHandler="notification.onClick"-->
      <!--:key="notification.timestamp.getTime()"-->
      <!--@close="removeNotification">-->
      <!--</notification>-->
      <div @click="tryClose"
           v-if="show"
           data-notify="container"
           class="alert open"
           :class="[{'alert-with-icon': icon}, verticalAlign, horizontalAlign, alertType]"
           role="alert"
           :style="customPosition"
           data-notify-position="top-center">
        <!--<button-->
        <!--v-if="showClose"-->
        <!--type="button"-->
        <!--aria-hidden="true"-->
        <!--class="close col-xs-1"-->
        <!--data-notify="dismiss"-->
        <!--@click="close">-->
        <!--<i class="now-ui-icons ui-1_simple-remove"></i>-->
        <!--</button>-->
        <!--<md-button class="md-icon-button close col-xs-1"-->
                   <!--v-if="showClose"-->
                   <!--data-notify="dismiss"-->
                   <!--@click="close">×-->
        <!--</md-button>-->

        <!--<span v-if="icon" data-notify="icon" :class="['alert-icon', icon]"></span>-->
        <i v-if="icon" data-notify="icon" class="material-icons">{{icon}}</i>

        <i class="icon-close material-icons" @click="close">close</i>
        <!--<i v-if="icon" data-notify="icon" class="material-icons now-ui-icons md-icon md-icon-font md-bottom-bar-icon md-theme-default">{{icon}}</i>-->
        <span data-notify="message">
          <!--<span v-if="title" class="title"><b>{{title}}<br/></b></span>-->
          <span v-if="title" class="title"><strong>{{title}}<br/></strong></span>
          <!--<span v-if="message" v-html="message"></span>-->
          <!--<content-render v-if="!message && component" :component="component"></content-render>-->
        </span>
        <div class="content-container">
          <slot/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'PopupAction',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      initialMargin: {
        type: Number,
        default: 20
      },
      // message: String,
      title: String,
      icon: String,
      verticalAlign: {
        type: String,
        default: 'top',
        validator: (value) => {
          let acceptedValues = ['top', 'bottom']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      horizontalAlign: {
        type: String,
        default: 'right',
        validator: (value) => {
          let acceptedValues = ['left', 'center', 'right']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      type: {
        type: String,
        default: 'info',
        validator: (value) => {
          let acceptedValues = ['info', 'primary', 'danger', 'warning', 'success']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      timeout: {
        type: Number,
        default: 30000,
        validator: (value) => {
          return value >= 0
        }
      },
      timestamp: {
        type: Date,
        default: () => new Date()
      },
      component: {
        type: [Object, Function]
      },
      showClose: {
        type: Boolean,
        default: true
      },
      closeOnClick: {
        type: Boolean,
        default: true
      },
      clickHandler: Function,
    },
    data() {
      return {
        elmHeight: 0
      }
    },
    computed: {
      hasIcon() {
        return this.icon && this.icon.length > 0
      },
      alertType() {
        return `alert-${this.type}`
      },
      customPosition() {
        let alertHeight = this.elmHeight + 10
        // let sameAlertsCount = this.$notifications.state.filter((alert) => {
        //   return alert.horizontalAlign === this.horizontalAlign && alert.verticalAlign === this.verticalAlign && alert.timestamp <= this.timestamp
        // }).length
        // if (this.$notifications.settings.overlap) {
        //   sameAlertsCount = 1
        // }
        let sameAlertsCount = 1
        let pixels = (sameAlertsCount - 1) * alertHeight + this.initialMargin
        let styles = {}
        if (this.verticalAlign === 'top') {
          styles.top = `${pixels}px`
        } else {
          styles.bottom = `${pixels}px`
        }
        return styles
      }
    },
    methods: {
      close() {
        // this.$emit('close', this.timestamp)
        this.$emit('update:show', false)
      },
      tryClose(evt) {
        if (this.clickHandler) {
          this.clickHandler(evt, this)
        }
        if (this.closeOnClick) {
          this.close()
        }
      }
    },
    mounted() {
      this.elmHeight = this.$el.clientHeight
      if (this.timeout) {
        setTimeout(this.close, this.timeout)
      }
    },
  }
</script>

<style scoped lang="scss">
  .icon-close {
    font-size: 16px!important;
    margin-top: 0px;
    margin-right: 0px;
    display: block;
    right: 0px;
    top: 0px;
    position: absolute;
    color: #fff!important;
    /*background-color: #fff;*/
    padding: 0px;
    /*border-radius: 50%;*/
    /*max-width: 20px;*/
    /*max-height: 20px;*/
  }
  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
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

  .title {
    color: #fff;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
  }

  .content-container {
    margin-top: 10px;
    width: 100%;
  }

  .notifications {
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;
    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }

    .list-enter {
      opacity: 0;
      transform: scale(1.1);

    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }

  /*.notifications .list-move {*/
  /*transition: transform .3s,opacity .4s*/
  /*}*/

  /*.notifications .list-item {*/
  /*display: inline-block;*/
  /*margin-right: 10px*/
  /*}*/

  /*.notifications .list-enter-active {*/
  /*transition: transform .2s ease-in,opacity .4s ease-in*/
  /*}*/

  /*.notifications .list-leave-active {*/
  /*transition: transform 1s ease-out,opacity .4s ease-out*/
  /*}*/

  /*.notifications .list-enter {*/
  /*opacity: 0;*/
  /*transform: scale(1.1)*/
  /*transform: scale(1.1)*/
  /*}*/

  /*.notifications .list-leave-to {*/
  /*opacity: 0;*/
  /*transform: scale(1.2,.7)*/
  /*}*/

  .notifications .alert {
    position: fixed;
    z-index: 10000;
    -webkit-box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  }

  .notifications .alert[data-notify=container] {
    width: 400px
  }

  .notifications .alert.center {
    left: 0;
    right: 0;
    margin: 0 auto
  }

  .notifications .alert.left {
    left: 20px
  }

  .notifications .alert.right {
    right: 20px
  }

  .notifications .alert {
    position: fixed;
    z-index: 10000;

    &[data-notify="container"] {
      width: 90%;
      max-width: 400px;
    }

    &.center {
      left: 0px;
      right: 0px;
      margin: 0 auto;
    }
    &.left {
      left: 20px;
    }
    &.right {
      right: 20px;
    }
  }

  .alert {
    border: 0;
    border-radius: .1875rem;
    color: #fff;
    padding-top: .9rem;
    padding-bottom: .9rem;
    position: relative
  }

  /*.alert.alert-danger i {*/
  /*color: #f44336;*/
  /*}*/
  .alert i[data-notify=icon] {
    display: block;
    left: 15px;
    position: absolute;
    margin-top: -30px;
    font-size: 20px;
    background-color: #fff;
    padding: 9px;
    border-radius: 50%;
    max-width: 38px;
    -webkit-box-shadow: 0 16px 38px -12px rgba(0, 0, 0, .56), 0 4px 25px 0 rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2);
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, .56), 0 4px 25px 0 rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2);
  }

  .alert.alert-success i {
    color: #1be611;
  }

  .alert.alert-danger i {
    color: #f44336;
  }

  .alert.alert-warning i {
    color: #ffbc50;
  }

  .alert.alert-info i {
    color: #46b3ff;
  }

  .alert.alert-primary i {
    color: #fa764b;
  }

  .alert.alert-success {
    background-color: #1be611
  }

  .alert.alert-danger {
    background-color: #ff5050
  }

  .alert.alert-warning {
    background-color: #ffbc50
  }

  .alert.alert-info {
    background-color: #46b3ff
  }

  .alert.alert-primary {
    background-color: #fa764b
  }

  .alert i.fa, .alert i.now-ui-icons {
    font-size: 20px
  }

  .alert .close {
    color: #fff;
    opacity: .9;
    text-shadow: none;
    line-height: 0;
    outline: 0
  }

  .alert span[data-notify=icon] {
    font-size: 22px;
    color: #fff;
    display: block;
    left: 19px;
    position: absolute;
    top: 50%;
    margin-top: -11px
  }

  .alert span {
    /*font-size: 22px;*/
    color: #fff;
  }

  .alert button.close {
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -13px;
    width: 25px;
    height: 25px;
    padding: 3px
  }

  .alert .close ~ span {
    display: block;
    max-width: 89%
  }

  .alert.alert-with-icon {
    padding-left: 65px
  }

  .alert {
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    /*border: 1px solid transparent;*/
    border-radius: .25rem
  }

  .alert-heading {
    color: inherit
  }

  .alert-link {
    font-weight: 700
  }

  .alert-dismissible {
    padding-right: 4rem
  }

  .alert-dismissible .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: .75rem 1.25rem;
    color: inherit
  }

  .alert-primary {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff
  }

  .alert-primary hr {
    border-top-color: #9fcdff
  }

  .alert-primary .alert-link {
    color: #002752
  }

  .alert-secondary {
    color: #383d41;
    background-color: #e2e3e5;
    border-color: #d6d8db
  }

  .alert-secondary hr {
    border-top-color: #c8cbcf
  }

  .alert-secondary .alert-link {
    color: #202326
  }

  .alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb
  }

  .alert-success hr {
    border-top-color: #b1dfbb
  }

  .alert-success .alert-link {
    color: #0b2e13
  }

  .alert-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb
  }

  .alert-info hr {
    border-top-color: #abdde5
  }

  .alert-info .alert-link {
    color: #062c33
  }

  .alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba
  }

  .alert-warning hr {
    border-top-color: #ffe8a1
  }

  .alert-warning .alert-link {
    color: #533f03
  }

  .alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb
  }

  .alert-danger hr {
    border-top-color: #f1b0b7
  }

  .alert-danger .alert-link {
    color: #491217
  }

  .alert-light {
    color: #818182;
    background-color: #fefefe;
    border-color: #fdfdfe
  }

  .alert-light hr {
    border-top-color: #ececf6
  }

  .alert-light .alert-link {
    color: #686868
  }

  .alert-dark {
    color: #1b1e21;
    background-color: #d6d8d9;
    border-color: #c6c8ca
  }

  .alert-dark hr {
    border-top-color: #b9bbbe
  }

  .alert-dark .alert-link {
    color: #040505
  }
</style>