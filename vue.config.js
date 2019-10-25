const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'docs'),
            routes: ['/', '/about', '/login', '/todo']
          })
        ]
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/test-automation-exercise-site/'
    : '/',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  outputDir: 'docs'
}
