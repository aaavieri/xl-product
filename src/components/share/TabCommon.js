import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    themeName: {
      type: String,
      default: 'default'
    }
  },
  inject: ['Frame'],
  data () {
    return {
      colorList: [
        {
          colorName: 'blue',
          colorShadow1: 'rgba(0,188,212,.28)',
          colorShadow2: 'rgba(0,188,212,.2)',
          colorBk1: '#26c6da',
          colorBk2: '#00acc1'
        }, {
          colorName: 'rose',
          colorShadow1: 'rgba(233,30,99,.28)',
          colorShadow2: 'rgba(233,30,99,.2)',
          colorBk1: '#ec407a',
          colorBk2: '#d81b60'
        }, {
          colorName: 'green',
          colorShadow1: 'rgba(76,175,80,.28)',
          colorShadow2: 'rgba(76,175,80,.2)',
          colorBk1: '#66bb6a',
          colorBk2: '#43a047'
        }, {
          colorName: 'yellow',
          colorShadow1: 'rgba(255,152,0,.28)',
          colorShadow2: 'rgba(255,152,0,.2)',
          colorBk1: '#ffa726',
          colorBk2: '#fb8c00'
        }, {
          colorName: 'default',
          colorShadow1: 'rgba(0, 0, 0, 0.28)',
          colorShadow2: 'rgba(0, 0, 0, 0.2)',
          colorBk1: '#625151',
          colorBk2: '#666666'
        }
      ],
      sortTypeList: [
        {
          sortKey: 'updateTime',
          sortName: '更新时间'
        }, {
          sortKey: 'createTime',
          sortName: '创建时间'
        }
      ],
      sortOrderList: [
        {
          sortBy: 'desc',
          sortValue: -1,
          sortIcon: 'arrow_downward'
        }, {
          sortBy: 'asc',
          sortValue: 1,
          sortIcon: 'arrow_upward'
        }
      ]
    }
  },
  computed: {
    ...mapState('share', ['favoriteList']),
    ...mapGetters('share', ['userSetting'])
  },
  mounted () {
    let bodyHeight = window.screen.height
    this.$el.querySelector('div.frame-app').style.height = `${bodyHeight - 60}px`
    this.$el.querySelector('div.frame-app').style.minHeight = `${bodyHeight - 60}px`
    this.$el.querySelector('div.frame-app').style.maxHeight = `${bodyHeight - 60}px`
  }
}