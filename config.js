const path = require('path')
const fs = require('fs-extra')

// 加载项目自定义配置
const loadConfig = sourceDir => {
  const configPath = path.resolve(sourceDir, 'config.js')
  let config = {}
  if (fs.existsSync(configPath)) {
    config = require(configPath)
  }
  return config
}

const defaultConfig = {
  // 运行端口
  port: 3000,
  // 代理配置
  proxy: {
    '/uploads': {
      target: 'http://127.0.0.1:80',
      changeOrigin: true
    },
    '/php': {
      target: 'http://127.0.0.1:80',
      changeOrigin: true
    }
  },
  // 入口目录
  inputPath: 'h5',
  // 输出目录
  outputPath: 'dist',
  // 文件引用路径别名
  alias: {
    common: path.resolve(__dirname, 'src/common'),
    '@h5': path.resolve(__dirname, 'src/h5')
  },
  // rem 转换基准
  basePixel: 100,
  // 公共模块
  chunks: {
    'common/js/common': path.resolve(__dirname, 'src/common/js/common.js')
  },
  // 编译地图开关
  sourceMap: true,
  // 选择性打包开关
  useOnly: false,
  // 选择性打包入口
  only: {
    'h5/create/index': path.resolve(__dirname, 'src/h5/create/index.jsx'),
    'h5/show/index': path.resolve(__dirname, 'src/h5/show/index.jsx')
  },
  /**
   * js 选择性注入判断函数
   * eg：
   * html: h5/create.pug => h5/create/index.jsx
   */
  injectCheck: (html, js) => {
    return html === js
  }
}

const projectConfig = loadConfig(path.resolve(__dirname, 'src'))

const CONFIG = { ...defaultConfig, ...projectConfig }

module.exports = CONFIG
