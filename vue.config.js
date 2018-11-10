module.exports = {
  devServer: {
    port: 8020
  },
  assetsDir: 'assets',
  baseUrl: './',
  pages: {
    product: {
      // entry for the page
      entry: 'src/product.js',
      // the source template
      template: 'public/product.html',
      // output as dist/index.html
      filename: 'product/index.html',
      title: '小鲤产品目录',
      chunks: ['chunk-vendors', 'chunk-common', 'product']
    },
    share: {
      // entry for the page
      entry: 'src/share.js',
      // the source template
      template: 'public/share.html',
      // output as dist/index.html
      filename: 'share/index.html',
      title: '小鲤产品分享',
      chunks: ['chunk-vendors', 'chunk-common', 'share']
    }
  },

  configureWebpack: {
    externals: {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      "vue-material": "VueMaterial",
      "axios": "axios",
      "velocity": "Velocity"
    }
  }
}
