import Router from 'vue-router'
import ShareFrame from '@/components/share/ShareFrame.vue'

export default new Router({
  // mode: 'history',
  base: '/share/',
  routes: [
    {
      path: '/',
      name: 'shareFrame',
      component: ShareFrame
    }
  ]
})
