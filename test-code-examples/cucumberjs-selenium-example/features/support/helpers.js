const HomePage = require('../pages/home_page.js')
const LoginPage = require('../pages/login_page.js')
const TodoListPage = require('../pages/todolist_page.js')
const AboutPage = require('../pages/about_page.js')

const { promisify } = require('util')
const fs = require('fs')

module.exports = {
  createPageObject: viewName => {
    switch (viewName) {
      case 'Home':
        return new HomePage()
      case 'About':
        return new AboutPage()
      case 'TodoList':
        return new TodoListPage()
      case 'Login':
        return new LoginPage()
      default:
        throw new Error(`an unexpected view name "${viewName}" is given.`)
    }
  },

  objectName2tagName: element => {
    switch (element) {
      case 'link':
        return 'a'
      case 'button':
        return 'button'
      default:
        throw new Error(`an unexpected element name "${element}" is given.`)
    }
  },

  headerTarget2selector: target => {
    switch (target) {
      case 'Top-Logo':
        return 'header #top-logo-link'
      case 'Hamburger-Icon':
        return 'header .navbar-burger'
      case 'Navigation-Bar':
        return 'header .navbar'
      case 'Navigation-Menu':
        return 'header .navbar-menu'
      default:
        throw new Error(`an unexpected item name "${target}" is given.`)
    }
  },

  changeWindowWidth: async (driver, width) => {
    const { height, x, y } = await driver.manage().window().getRect()
    await driver.manage().window().setRect({ width, height, x, y })

    await driver
      .wait(
        _forWindowSizeToBe(driver, width, height),
        10000,
        'Failed to resize window.'
      )
  },

  saveScreenshot: async (driver, filename) => {
    const path = './output/'
    const image = await driver.takeScreenshot()

    const mkdir = promisify(fs.mkdir)
    const writeFile = promisify(fs.writeFile)

    if (!fs.existsSync(path)) {
      await mkdir(path)
        .catch(error => { throw error })
    }

    await writeFile(
      `${path}${filename}.png`,
      image.replace(/^data:image\/png;base64,/, ''),
      'base64'
    )
      .then(console.log(`\n[FAILED] Save screenshot: ${filename}`))
      .catch(error => { throw error })
  },
}

function _forWindowSizeToBe (driver, w, h) {
  return async () => {
    const { width, height } = await driver.manage().window().getRect()
    return width === w && height === h
  }
}
