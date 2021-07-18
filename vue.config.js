'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

/**
 * 需求：生产环境排除大文件 vue element xlsx 三个包===>开发环境不排除
 */
let externals = {} // 排除的包对象，默认为空
let cdn = { css: [], js: [] } // 排除后需要引入的CDN地址
const isProduction = process.env.NODE_ENV === 'production' // 判断是否是生产环境
if (isProduction) {
  externals = {
    'vue': 'Vue',
    'element-ui': 'ELEMENT',
    'xlsx': 'XLSX'
  }
  cdn = {
    css: [
      // element-ui css 样式表 在main.js文件内也需要根据环境去判断，是否加载css样式
      'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/index.css'
    ],
    js: [
      // vue must at first!
      'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      // element-ui js
      'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/index.js',
      // xlsx
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js'
    ]
  }
}

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')
    // 代理配置
    proxy: {
      // 表示如果我们的请求地址有/api的时候,就出触发代理机制
      // http://localhost:8888/api/login ->  http://www.baidu.com/api/login
      // 接口域名发生变化 其余地址保持不变
      '/api': {
        target: 'http://ihrm-java.itheima.net', // 我们要代理的真实接口地址
        // target: 'http://www.itcbc.com:3000', // 效果不错的接口
        // target: 'http://192.168.141.82:3000', // 教室本地存储
        changeOrigin: true // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        // 路径重写
        // 如果我们不光要使得域名修改,而且还需要改变其它路径,则需要做路径重写
        // 比如 我们想把请求的api去掉（真实后台没有api前缀情况）
        // localhost:8888/api/login -> www.baidu.com/login
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  },
  // 在configureWebpack下添加 externals让webpack不打包vue,xlsx和element
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    // 配置单页应用程序的页面的标题
    name: name,
    // // 排除大文件的包
    // externals: {
    //   // externals 对象属性解析：
    //   //  '包名' : '内置对象'  ===>当前包JS代码里的全局模块对象==>默认挂到window.模块内置对象
    //   'vue': 'Vue',
    //   'element-ui': 'ELEMENT',
    //   'xlsx': 'XLSX'
    // },
    externals,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack (config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 注入CDN地址到html页面(打包时会执行)
    config.plugin('html').tap(args => {
      args[0].cdn = cdn // 配置cdn给插件
      return args
    })

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
