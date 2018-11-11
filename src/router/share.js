// import Vue from 'vue'
import Router from 'vue-router'
import Frame from '@/components/Frame.vue'
// import Home from '@/views/Home.vue'
// import compsConfig from '@/components/comps.config'

// Vue.use(Router)

// let routes = []
// compsConfig.map(item => {
//   routes.push({
//     path: item.path,
//     name: item.name,
//     props: true,
//     // component: resolve => require([`@/components/${item.name}.vue`], resolve)
//     component: () => import(/* webpackChunkName: "about" */ `@/components/${item.name}.vue`)
//   })
// })
export default new Router({
  // mode: 'history',
  base: '/product/',
  routes: [
    {
      path: '/',
      name: 'Frame',
      component: Frame
    },
    {
      path: '/detail',
      name: 'Detail',
      props: true,
      component: () => import ('@/components/Detail.vue')
    }
  ]
})
