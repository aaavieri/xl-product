<template>
  <div class="floating-theme-selector md-elevation-20" :style="style" :class="menuClass" @click="click()">
    <div class="floating-theme-selector-items">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingMenu',
  data () {
    return {
      isActive: this.active
    }
  },
  methods: {
    click () {
      this.isActive = !this.isActive
      this.$emit('update:active', this.isActive)
    }
  },
  computed: {
    style () {
      return {
        top: this.top,
        right: this.right
      }
    },
    menuClass () {
      return this.isActive ? 'active' : ''
    }
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '50%'
    },
    right: {
      type: String,
      default: '0px'
    }
  }
}
</script>

<style scoped>
  .floating-theme-selector {
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
    max-height: 40px;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: end;
    align-items: flex-end;
    overflow: hidden;
    position: fixed;
    top: 50%;
    right: 40px;
    -webkit-transform: translate3D(80px,0%,0);
    transform: translate3D(80px,0%,0);
    border-radius: 20px 0 0 20px;
    transition: .3s cubic-bezier(.4,0,.2,1);
    transition-property: border-radius,max-height,-webkit-transform;
    transition-property: border-radius,max-height,transform;
    transition-property: border-radius,max-height,transform,-webkit-transform;
    will-change: border-radius,max-height,transform
  }

  .floating-theme-selector.active {
    max-height: 215px;
    border-radius: 2px 0 0 2px;
    -webkit-transform: translate3d(0,0%,0);
    transform: translate3d(0,-50%,0)
  }

  .floating-theme-selector.active .md-list {
    padding: 4px 0;
    opacity: 1
  }

  .floating-theme-selector.active .md-list .md-list-item:first-child~.md-list-item {
    opacity: 1
  }

  .floating-theme-selector.active .md-list .md-list-item:first-child .md-list-item-content {
    padding-left: 16px;
    font-weight: 700;
    border-bottom: 1px solid rgba(0,0,0,.12)
  }

  .floating-theme-selector-items .md-list {
    padding: 0;
    border-bottom-left-radius: 2px
  }

  .floating-theme-selector-items .md-list .md-list-item:first-child~.md-list-item {
    opacity: 0;
    transition: opacity .35s cubic-bezier(.55,0,.55,.2);
    will-change: opacity
  }

  .floating-theme-selector-items.md-list .md-list-item:first-child .md-list-item-content {
    padding-left: 8px
  }

  .floating-theme-selector-items .md-list .md-list-item-content {
    -webkit-box-pack: start;
    justify-content: flex-start
  }
</style>
