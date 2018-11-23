module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  devServer: {
    port: 8020
  },
  assetsDir: 'assets',
  baseUrl: process.env.NODE_ENV === 'production' ? '../' : './',
  // baseUrl: './',
  pages: {
    product: {
      // entry for the page
      entry: 'src/product.js',
      // the source template
      template: 'public/product.html',
      // output as dist/index.html
      filename: 'product/index.html',
      title: '小鲤巴巴—基因产品目录',
      chunks: ['chunk-vendors', 'chunk-common', 'product']
    },
    share: {
      // entry for the page
      entry: 'src/share.js',
      // the source template
      template: 'public/share.html',
      // output as dist/index.html
      filename: 'share/index.html',
      title: '小鲤巴巴—基因产品分享',
      chunks: ['chunk-vendors', 'chunk-common', 'share']
    }
  },

  css: {
    extract: true
  },

  configureWebpack: {
    externals: process.env.NODE_ENV === 'production' ? {
      "vue": "Vue",
      "vuex": "Vuex",
      "vue-router": "VueRouter",
      "vue-material": "VueMaterial",
      "axios": "axios",
      "velocity": "Velocity",
      "sweetalert2": "swal",
      "vue-draggable": "VueDraggable",
      "vue-clipboard2": "VueClipboard",
      "vue-toasted": "Toasted",
      "vue2-touch-events": "vueTouchEvents"
    } : {
      "vue": "Vue",
      "vuex": "Vuex",
      "vue-router": "VueRouter",
      "axios": "axios",
      "velocity": "Velocity",
      "sweetalert2": "swal",
      "vue-draggable": "VueDraggable",
      "vue-clipboard2": "VueClipboard",
      "vue-toasted": "Toasted",
      "vue2-touch-events": "vueTouchEvents"
    }
  }
}
