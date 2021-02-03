const webpack = require('webpack');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {

  productionSourceMap: false,

  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale/,
        /(en-gb|ru).js/
      ),
    ]
  },

  chainWebpack: config => {
    config.plugin('VuetifyLoaderPlugin').tap(args => [{
      match (originalTag, { kebabTag, camelTag, path, component }) {
        if (kebabTag.startsWith('core-')) {
          return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
        }
      }
    }])
  },

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
      reportFilename: '../bundle.report.html'
    }
  },

  transpileDependencies: [
    'vuetify'
  ],



  pwa: {
    // this generates manifest json
    name: 'Finance Bookkeeper',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    iconPaths: {
      favicon16: 'img/icons/favicon-16x16.png',
      favicon32: 'img/icons/favicon-32x32.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-150x150.png'
    },

    // configure the workbox plugin


    workboxPluginMode: 'GenerateSW',

    workboxOptions: {
      include: /\.(css|ico|png|xml|svg|webmanifest|html|js|json|txt|jpg|woff2)/,

//      swSrc: 'src/service-worker.js',

      navigateFallback: 'index.html',
      navigationPreload: true,
      runtimeCaching: [
        {
          urlPattern: ({url}) => url.origin === self.location.origin &&
            url.pathname.match(/\.(css|ico|png|xml|svg|webmanifest|html|js|json|txt|jpe?g|woff2?)$/),
          handler: 'CacheFirst',
          options: {
            cacheName: 'finance-bookkeeper-cache'
          }
        },

        {
          urlPattern: ({url}) => url.origin === 'https://fonts.googleapis.com',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },

        {
          urlPattern: ({url}) => url.origin === 'https://fonts.gstatic.com',
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts'
          }
        },

        {
          urlPattern: ({url}) => url.origin === 'https://cdn.jsdelivr.net'
            && url.pathname.match(/\.(css|woff2?)$/),
          handler: 'CacheFirst',
          options: {
            cacheName: 'material-design-icons-cache'
          }
        }


      ] //runtimeCaching

    } // workboxOptions

  } //pwa


}
