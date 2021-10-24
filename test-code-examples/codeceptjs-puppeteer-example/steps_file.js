module.exports = function() {
  return actor({

    setTokenCookie () {
      const cookieKey = 'PtExampleToken'
      const cookieValue = '{%22auth%22:{%22token%22:%22dummy-token%22}}'

      this.amOnPage('/about')
      this.setCookie({ name: cookieKey, value: cookieValue })
      // apply added cookie by refresh
      this.refreshPage('/')
    },

    seeElementIsDisabled (locator) {
      this.seeAttributesOnElements(locator, { disabled: true })
    },

    registerNewSubject (text) {
      this.fillField({ css: 'input#subject-input' }, text)
      this.waitForEnabled({ css: 'button#subject-submit' })
      this.click({ css: 'button#subject-submit' })
    },

    grabTodoLocalStorage () {
      return this.executeScript(function() {
        return JSON.parse(localStorage.PtExampleTodos)
      })
    },

    async simulateDragAndDrop (sourceLocator, targetLocator) {
      // NOTE:
      // CodeceptJS's dragAndDrop action does not work for vuedraggable component

      await this.executeScript(
        async (sourceLocator, targetLocator) => {
          const sourceElement = document.querySelector(sourceLocator.css)
          const targetElement = document.querySelector(targetLocator.css)

          const targetRect = targetElement.getBoundingClientRect()
          const targetPositionX = (targetRect.left + targetRect.right) / 2
          const targetPositionY = (targetRect.top + targetRect.bottom) / 2

          const pointerDownEvent = new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
          })

          const dragStartEvent = new DragEvent('dragstart', {
            bubbles: true,
          })

          const dragOverEvent = new DragEvent('dragover', {
            bubbles: true,
            clientX: targetPositionX,
            clientY: targetPositionY,
          })

          const dropEvent = new DragEvent('drop', {
            bubbles: true,
          })

          const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

          sourceElement.dispatchEvent(pointerDownEvent)
          sourceElement.dispatchEvent(dragStartEvent)
          await sleep(1)
          targetElement.dispatchEvent(dragOverEvent)
          targetElement.dispatchEvent(dropEvent)
        }, sourceLocator, targetLocator
      )
    },

  })
}
