const CONFIG = require('./config')

module.exports = {
  plugins: [
    require('postcss-initial')(),
    require('postcss-import')(),
    require('postcss-pxtorem')({
      rootValue: CONFIG.basePixel,
      propWhiteList: []
    }),
    require('postcss-preset-env')({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    })
  ]
}
