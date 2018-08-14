const path = require('path')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    'index': path.resolve(__dirname, 'src/index.jsx')
  },
  output: {
    // 静态资源文件的本机输出目录
    path: path.resolve(__dirname, 'src/lib'),
    // 入口文件名称配置
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
}
