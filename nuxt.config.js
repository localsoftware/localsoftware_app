const webpack = require('webpack')
// const pkg = require('./package')

// const API_HOST = process.env.API_HOST || '0.0.0.0'
const API_SERVER_HOST = process.env.API_SERVER_HOST || 'localhost'
const API_SERVER_PORT = process.env.API_SERVER_PORT || '3000'

const title = 'Local Code'
const desc =
  'Local Code is a set of tools allowing the packaging and re-interpreting of digital map (GIS) data to allow desktop design projects on multiple, interacting sites simultaneously, helping to create more networked, robust and resilient cities and landscapes.'

module.exports = {
  telemetry: false,

  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: desc,
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // pwa/meta module
  meta: {
    name: title,
    author: 'Nicholas de Monchaux',
    description: desc,

    /*
    favicon
    ogHost
    ogUrl
    ogImage
    twitterCard
    twitterSite
    twitterCreator
    */
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#8280ff' },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/less/antd.less',
    'mapbox-gl/dist/mapbox-gl.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/css/mij1dze.css',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/axios',
    '@/plugins/vue-rx',
    '@/plugins/fa-icon',
    '@/plugins/motion',
    '@/plugins/amplify.client',
    '@/plugins/amplify.server',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
  ],
  buildModules: [
    // buildModules: https://nuxtjs.org/api/configuration-modules/#-code-buildmodules-code-
    '@nuxtjs/tailwindcss',
  ],

  styleResources: {
    // :warning: You cannot use path aliases here (~ and @)
    scss: ['./assets/scss/*.scss'],
    // less: ['./assets/less/*.less'], // doesn't work.
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true,
  },
  proxy: {
    '/api': {
      target: `http://${API_SERVER_HOST}:${API_SERVER_PORT}`,
      pathRewrite: {
        '^/api/': '/',
      },
    },
  },

  // workbox config https://pwa.nuxtjs.org/modules/workbox.html
  workbox: {
    config: {
      debug: true,
    },
    runtimeCaching: [
      {
        urlPattern: 'https://fonts.gstatic.com/',
        handler: 'staleWhileRevalidate',
        cacheName: 'google-fonts-files',
      },
      {
        urlPattern: 'https://fonts.googleapis.com',
        handler: 'staleWhileRevalidate',
        cacheName: 'google-fonts-stylesheets',
      },
      {
        urlPattern: '/api/getThumbnailData/[0-9]+',
        handler: 'cacheFirst',
        cacheName: 'layer-geometry',
        strategyOptions: {
          cacheExpiration: {
            maxEntries: 100,
            maxAgeSeconds: 5184000, // 60 days
          },
        },
      },
    ],
  },

  /*
   ** Build configuration
   */
  build: {
    // improve build speed
    parallel: true,
    cache: true,

    /**
     * ISSUE: has error after upgrading to nuxt version ^2.9
     * error log:
     * [hardsource] Could not freeze ./__.__.js: Cannot read property 'hash' of undefined
     *  */
    // hardSource: true,

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      /**
       * HOTFIX:
       * issue: installing amplify has a node dependency error with webpack.
       * ref: https://github.com/aws-amplify/amplify-js/issues/5827
       * ref: https://github.com/nuxt/nuxt.js/issues/3951#issuecomment-424874010
       */

      for (const plugin of config.plugins) {
        if (plugin.constructor.name === 'HtmlWebpackPlugin') {
          plugin.options = Object.assign(plugin.options, {
            chunksSortMode: 'none',
          })
        }
      }
      /* HOTFIX: END */

      const { loaders } = ctx
      loaders.less.javascriptEnabled = true
    },
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl',
      }),
    ],
  },
}
