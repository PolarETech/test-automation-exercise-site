const dayjs = require('dayjs')
// WARNING:
// In rare cases, the test about timestamp may fail due to a second difference
// between the timestamp stored in Vuex and
// the timestamp obtained in the Scenario.

Feature('TodoList view test.js @todo @desktop')

Before(({ I }) => {
  I.setTokenCookie()
  I.amOnPage('/todo')
})

Scenario('displays "TodoList" page', ({ I }) => {
  I.seeTitleEquals('TodoList | test automation exercise site')
  I.seeElement({ css: 'header .navbar' })
  I.see('ToDoリスト', { css: 'h1' })
  I.see('ToDoは登録されていません', { css: '#empty-message' })
  I.dontSeeElement({ css: '.todo-list' })
  I.seeElementIsDisabled({ css: 'button#subject-submit' })
  I.seeElement({ css: 'input#subject-input' })
  I.see('登録件数：0 / 5 件', { css: '#item-count' })
  I.see('© 2019 Polar Tech', { css: 'footer' })
}).tag('@smoke')

Scenario('adds a ToDo item', async ({ I }) => {
  let timestamp
  I.fillField('ToDoの件名を入力してください', 'テストアイテム１')
  I.waitForEnabled({ css: 'button#subject-submit' })

  // NOTE:
  // await is required to adjust the timing of assignment to the timestamp variable
  await I.click({ css: 'button#subject-submit' })
  timestamp = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')

  I.waitForElement({ css: '.todo-list' })
  I.dontSee('ToDoは登録されていません')
  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  I.dontSeeCheckboxIsChecked({ css: '.todo-check' })
  I.see(`確認日時：${timestamp}`, { css: '.todo-timestamp' })
  I.see('登録件数：1 / 5 件', { css: '#item-count' })

  const storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')
  I.seeEqual(storageData.todo.items[0].isDone, false)
  I.seeEqual(storageData.todo.items[0].timestamp, timestamp)
}).tag('@smoke')

Scenario('changes ToDo item checkbox to ON', async ({ I }) => {
  let timestamp
  I.registerNewSubject('テストアイテム１')
  I.dontSeeCheckboxIsChecked({ css: '.todo-check' })

  // wait to advance timestamp
  // NOTE:
  // await is required to adjust the timing of assignment to the timestamp variable
  await I.wait(1)

  // checkbox ON
  I.click({ css: '.todo-check+label' })
  timestamp = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')

  I.seeCheckboxIsChecked({ css: '.todo-check' })
  // timestamp should be updated
  I.see(`確認日時：${timestamp}`, { css: '.todo-timestamp' })
  // local storage should be updated
  const storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].isDone, true)
  I.seeEqual(storageData.todo.items[0].timestamp, timestamp)
}).tag('@smoke')

Scenario('changes ToDo item checkbox to OFF', async ({ I }) => {
  let timestamp
  I.registerNewSubject('テストアイテム１')
  I.click({ css: '.todo-check+label' })
  I.seeCheckboxIsChecked({ css: '.todo-check' })

  // wait to advance timestamp
  // NOTE:
  // await is required to adjust the timing of assignment to the timestamp variable
  await I.wait(1)

  // checkbox OFF
  I.click({ css: '.todo-check+label' })
  timestamp = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')

  I.dontSeeCheckboxIsChecked({ css: '.todo-check' })
  // timestamp should be updated
  I.see(`確認日時：${timestamp}`, { css: '.todo-timestamp' })
  // local storage should be updated
  const storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].isDone, false)
  I.seeEqual(storageData.todo.items[0].timestamp, timestamp)
}).tag('@smoke')

Scenario('changes a ToDo item subject', async ({ I }) => {
  let storageData
  I.registerNewSubject('テストアイテム１')
  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')

  // change subject
  I.click({ css: '.todo-subject' })
  I.pressKey('Backspace')
  I.appendField({ css: '.todo-subject' }, '２')
  I.pressKey('Enter')

  I.seeInField({ css: '.todo-subject' }, 'テストアイテム２')
  // local storage should be updated
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム２')
}).tag('@smoke')

Scenario('re-order ToDo items', async ({ I }) => {
  let storageData
  I.registerNewSubject('テストアイテム１')
  I.registerNewSubject('テストアイテム２')
  I.seeNumberOfElements({ css: '.todo-subject' }, 2)
  I.seeInField(locate({ css: '.todo-subject' }).at(1), 'テストアイテム１')
  I.seeInField(locate({ css: '.todo-subject' }).at(2), 'テストアイテム２')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')
  I.seeEqual(storageData.todo.items[1].subject, 'テストアイテム２')

  // Drag and Drop
  await I.simulateDragAndDrop(
    { css: 'ul.todo-list li:first-of-type .drag-icon' },
    { css: 'ul.todo-list li:last-of-type .drag-icon' }
  )

  I.seeNumberOfElements({ css: '.todo-subject' }, 2)
  I.seeInField(locate({ css: '.todo-subject' }).at(1), 'テストアイテム２')
  I.seeInField(locate({ css: '.todo-subject' }).at(2), 'テストアイテム１')
  // local storage should be updated
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム２')
  I.seeEqual(storageData.todo.items[1].subject, 'テストアイテム１')
}).tag('@smoke')

Scenario('removes a ToDo item and the list is empty', async ({ I }) => {
  let storageData
  I.registerNewSubject('テストアイテム１')
  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')

  I.click({ css: '.todo-remove' })
  I.seeNumberOfElements({ css: '.todo-subject' }, 0)
  // local storage should be empty
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items.length, 0)
  I.see('ToDoは登録されていません', { css: '#empty-message' })
}).tag('@smoke')

Scenario('removes a ToDo item and another ToDo item remains in the list', async ({ I }) => {
  let storageData
  I.registerNewSubject('テストアイテム１')
  I.registerNewSubject('テストアイテム２')
  I.seeNumberOfElements({ css: '.todo-subject' }, 2)
  I.seeInField(locate({ css: '.todo-subject' }).at(1), 'テストアイテム１')
  I.seeInField(locate({ css: '.todo-subject' }).at(2), 'テストアイテム２')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')
  I.seeEqual(storageData.todo.items[1].subject, 'テストアイテム２')

  I.click({ css: '.todo-remove' })
  I.seeNumberOfElements({ css: '.todo-subject' }, 1)
  I.seeInField(locate({ css: '.todo-subject' }).at(1), 'テストアイテム２')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム２')
  I.dontSee('ToDoは登録されていません')
})

Scenario('stores a ToDo item after logging out/in', async ({ I }) => {
  let timestamp
  let storageData
  I.registerNewSubject('テストアイテム１')

  // NOTE:
  // await is required to adjust the timing of assignment to the timestamp variable
  await I.click({ css: '.todo-check+label' })
  timestamp = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')

  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  I.seeCheckboxIsChecked({ css: '.todo-check' })
  I.see(`確認日時：${timestamp}`, { css: '.todo-timestamp' })
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')
  I.seeEqual(storageData.todo.items[0].isDone, true)
  I.seeEqual(storageData.todo.items[0].timestamp, timestamp)

  I.click('Logout', { css: '.navbar-menu' })
  I.click('TodoList', { css: '.navbar-menu' })

  I.fillField('ユーザーIDを入力してください', 'testID')
  I.fillField('パスワードを入力してください', 'testPASS')
  I.waitForEnabled({ css: 'button#login-submit' })
  I.click('ログイン')
  I.waitForElement({ css: '.todo-list' }, 10)

  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  I.seeCheckboxIsChecked({ css: '.todo-check' })
  I.see(`確認日時：${timestamp}`, { css: '.todo-timestamp' })
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')
  I.seeEqual(storageData.todo.items[0].isDone, true)
  I.seeEqual(storageData.todo.items[0].timestamp, timestamp)
})

Scenario('adds the ToDo item which has maximum number of characters', async ({ I }) => {
  I.registerNewSubject('1234567890ABCDE')
  I.seeInField({ css: '.todo-subject' }, '1234567890ABCDE')
  const storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, '1234567890ABCDE')
})

Scenario('tries to add the ToDo item which has exceeded the number of characters', async ({ I }) => {
  I.registerNewSubject('1234567890ABCDEF')
  I.seeInField({ css: '.todo-subject' }, '1234567890ABCDE')
  const storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, '1234567890ABCDE')
})

const subjects = new DataTable(['subject'])
subjects.add(['ア１a!"\',./:;=?\\'])
subjects.add(['あA　ヲンヰヱ<a>ヴーヾ・'])
subjects.add(['ａ1"＠ ｧｰｭ","ｿﾏﾞﾟ'])
subjects.add(['Ａｱ@&lt;(&copy;)'])
subjects.add(['亜,\'&amp;㈱£𠀋表\''])
subjects.add(['<span>🍺</span>'])

Data(subjects).Scenario('adds the ToDo item which has each character type', async ({ I, current }) => {
  I.registerNewSubject(current.subject)
  I.seeInField({ css: '.todo-subject' }, current.subject)
  const storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, current.subject)
})

Scenario('adds maximum number of Todo items', async ({ I }) => {
  let storageData

  for (let i = 1; i < 6; i++) {
    I.registerNewSubject(`テストアイテム${i}`)
    I.seeInField(locate({ css: '.todo-subject' }).at(i), `テストアイテム${i}`)
    I.see(`登録件数：${i} / 5 件`, { css: '#item-count' })
    storageData = await I.grabTodoLocalStorage()
    I.seeEqual(storageData.todo.items[i - 1].subject, `テストアイテム${i}`)
  }

  I.seeNumberOfElements({ css: '.todo-subject' }, 5)
  I.dontSeeElement({ css: 'button#subject-submit' })
  I.dontSeeElement({ css: 'input#subject-input' })
})

Scenario('tries to change a ToDo item subject to empty', async ({ I }) => {
  let storageData
  I.registerNewSubject('テストアイテム１')
  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')

  // clear subject
  I.click({ css: '.todo-subject' })
  for (let i = 0; i < 'テストアイテム１'.length; i++) {
    I.pressKey('Backspace')
  }
  I.pressKey('Enter')

  // should be restored the original subject
  I.seeInField({ css: '.todo-subject' }, 'テストアイテム１')
  storageData = await I.grabTodoLocalStorage()
  I.seeEqual(storageData.todo.items[0].subject, 'テストアイテム１')
})
