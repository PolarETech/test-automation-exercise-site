module.exports = class BasePage {
  constractor () {}

  getTargetLocator (target) {
    const locator = this.locators[target]
    if (locator === undefined) {
      throw new Error(`invalid item name "${target}" is given.`)
    }
    return locator
  }

  getTargetMessage (target) {
    const message = this.text[target]
    if (message === undefined) {
      throw new Error(`invalid message name "${target}" is given.`)
    }
    return message
  }
}