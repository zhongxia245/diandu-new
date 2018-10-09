const os = require('os')
const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const QiniuPlugin = require('./webpack.qiniu')

const CONFIG = require('./config')

const isLocal = process.env.NODE_ENV === 'localhost'
const isProd = process.env.NODE_ENV === 'production'

// 根据匹配规则输出正确的文件路径
const getEntries = pattern => {
  var fileList = glob.sync(pattern)
  return fileList.reduce((previous, current) => {
    var filePath = path.parse(path.relative(path.resolve(__dirname, 'src'), current))
    var withoutSuffix = path.join(filePath.dir, filePath.name)
    previous[withoutSuffix] = path.resolve(__dirname, current)
    return previous
  }, {})
}

const jsRegx = `${CONFIG.inputPath}/**/*.jsx`
const htmlRegx = `${CONFIG.inputPath}/**/*.pug`
const jsEntries = isLocal && CONFIG.useOnly ? CONFIG.only : getEntries(jsRegx)
const htmlEntries = getEntries(htmlRegx)

let htmlPlugins = []
for (htmlEntry in htmlEntries) {
  const config = {
    filename: htmlEntry + '.html',
    template: htmlEntries[htmlEntry],
    chunks: [],
    inject: true,
    hash: isLocal,
    cache: true,
    chunksSortMode: 'manual',
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  }
  // 注入公共库
  for (key in CONFIG.chunks) {
    config.chunks.push(key)
  }
  // 遍历判断注入
  for (jsEntry in jsEntries) {
    if (CONFIG.injectCheck(htmlEntry, jsEntry)) {
      config.chunks.push(jsEntry)
    }
  }
  htmlPlugins.push(new HtmlWebpackPlugin(config))
}

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
// 不同环境插件配置
let plugins = [
  new HappyPack({
    id: 'pug',
    threadPool: happyThreadPool,
    loaders: ['pug-loader']
  }),
  new HappyPack({
    id: 'json',
    threadPool: happyThreadPool,
    loaders: ['json-loader']
  }),
  new HappyPack({
    id: 'jsx',
    threadPool: happyThreadPool,
    loaders: ['babel-loader']
  }),
  new HappyPack({
    id: 'css',
    threadPool: happyThreadPool,
    loaders: ['css-loader?minimize', 'postcss-loader']
  }),
  new HappyPack({
    id: 'less',
    threadPool: happyThreadPool,
    loaders: ['css-loader?minimize', 'postcss-loader', 'less-loader']
  }),
  ...htmlPlugins,
  new MiniCssExtractPlugin({
    filename: isLocal ? '[name].css' : '[name]-[contenthash].css'
  })
]
// 本地开发热替换插件
if (isLocal) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

// 生产环境上传七牛插件,暂时不用
// if (isProd) {
//   plugins.push(
//     new QiniuPlugin({
//       accessKey: process.env.QINIU_AK,
//       secretKey: process.env.QINIU_SK,
//       bucket: process.env.QINIU_BUCKET,
//       path: '',
//       exclude: /\.html$/
//     })
//   )
// }

module.exports = {
  mode: isLocal ? 'development' : 'production',
  devtool: isLocal && CONFIG.sourceMap ? 'cheap-module-eval-source-map' : false,
  entry: {
    ...CONFIG.chunks,
    ...jsEntries
  },
  output: {
    // 静态资源文件的本机输出目录
    path: path.resolve(__dirname, CONFIG.outputPath),
    // 静态资源服务器发布目录
    publicPath: isProd ? process.env.PUBLIC_PATH : '/',
    // 入口文件名称配置
    filename: isLocal ? '[name].js' : '[name]-[chunkhash].js'
  },
  devServer: {
    proxy: CONFIG.proxy,
    historyApiFallback: true,
    inline: true,
    progress: false,
    compress: true,
    port: CONFIG.port,
    host: '127.0.0.1',
    disableHostCheck: true,
    contentBase: path.resolve(__dirname, CONFIG.outputPath)
  },
  resolve: {
    extensions: ['.js', '.jsx', 'json', '.less'],
    alias: CONFIG.alias
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'happypack/loader?id=pug'
      },
      {
        test: /\.json$/,
        use: 'happypack/loader?id=json'
      },
      {
        test: /.jsx?$/,
        use: 'happypack/loader?id=jsx',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=less']
      },
      {
        test: /.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8,
              outputPath: `${CONFIG.inputPath}/assets/images`,
              name: '[name]-[hash].[ext]',
              fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  },
  plugins: plugins
}
