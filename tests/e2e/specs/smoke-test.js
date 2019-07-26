import dayjs from 'dayjs'

describe('Smoke Testing Suite', () => {
  describe('Page loading test', () => {
    it('loads "Home" page', () => {
      cy.visit('/')
      cy.title().should('eq', 'Home | test automation exercise site')
      cy.get('h1').should('contain', 'TEST AUTOMATION EXERCISE SITE')
    })

    it('loads "About" page', () => {
      cy.visit('/about')
      cy.title().should('eq', 'About | test automation exercise site')
      cy.get('h1').should('contain', 'このサイトについて')
    })

    it('loads "Login" page', () => {
      cy.visit('/login')
      cy.title().should('eq', 'Login | test automation exercise site')
      cy.get('h1').should('contain', 'ログイン')
    })

    it('loads "Todo" page', () => {
      cy.setTokenCookie()
      cy.visit('/todo')
      cy.title().should('eq', 'TodoList | test automation exercise site')
      cy.get('h1').should('contain', 'ToDoリスト')
    })
  })

  describe('Login operation test', () => {
    it('moves to "Todo" page and sets auth token cookie when logging in via form submission', () => {
      cy.visit('/login')
      cy.get('#user-id-input').type('testID')
      cy.get('#password-input').type('testPASS')
      cy.get('#login-submit').click()
      cy.title().should('eq', 'TodoList | test automation exercise site')
      cy.getCookie('PtExampleToken')
        .should('exist')
        .and((cookieData) => {
          const cookieValue = JSON.parse(decodeURI(cookieData.value))
          expect(cookieValue.auth.token).to.eq('dummy-token')
        })
    })
  })

  describe('TodoList operation test', () => {
    beforeEach(() => {
      cy.setTokenCookie()
      cy.visit('/todo')
    })

    it('shows no items message in the initial state', () => {
      cy.get('#empty-message').should('contain', 'ToDoは登録されていません')
    })

    it('adds a ToDo item', () => {
      // omit HH:mm:ss confirmation in timestamp because it is difficult to match the time in seconds
      let date = dayjs(new Date()).format('YYYY/MM/DD')
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('.todo-check').should('not.be.checked')
      cy.get('.todo-timestamp').should('contain', date)
      cy.get('.todo-subject').should('have.value', 'テストアイテム１')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].isDone).to.eq(false)
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
        })
      cy.get('.todo-timestamp').invoke('text').then((t) => {
        const timestamp = t.slice(5)
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].timestamp).to.eq(timestamp)
      })
    })

    it('changes ToDo item checkbox to ON', () => {
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('.todo-check').should('not.be.checked')
      // wait to advance timestamp
      cy.wait(1000)

      // checkbox ON
      cy.get('.todo-timestamp').invoke('text').then((t) => {
        cy.get('.todo-check+label').click()
        cy.get('.todo-check').should('be.checked')
        // timestamp should be updated
        cy.get('.todo-timestamp').should('not.contain', t)
      })
      // local storage should be updated
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].isDone).to.eq(true)
        })
      cy.get('.todo-timestamp').invoke('text').then((t) => {
        const timestamp = t.slice(5)
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].timestamp).to.eq(timestamp)
      })
    })

    it('changes ToDo item checkbox to OFF', () => {
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('.todo-check+label').click()
      cy.get('.todo-check').should('be.checked')
      // wait to advance timestamp
      cy.wait(1000)

      // checkbox OFF
      cy.get('.todo-timestamp').invoke('text').then((t) => {
        cy.get('.todo-check+label').click()
        cy.get('.todo-check').should('not.be.checked')
        // timestamp should be updated
        cy.get('.todo-timestamp').should('not.contain', t)
      })
      // local storage should be updated
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].isDone).to.eq(false)
        })
      cy.get('.todo-timestamp').invoke('text').then((t) => {
        const timestamp = t.slice(5)
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].timestamp).to.eq(timestamp)
      })
    })

    it('changes a ToDo item subject', () => {
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('.todo-subject').should('have.value', 'テストアイテム１')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
        })
      cy.get('.todo-subject').type('{backspace}２').blur()
        .should('not.have.value', 'テストアイテム１')
        .should('have.value', 'テストアイテム２')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム２')
        })
    })

    it('re-order ToDo items', () => {
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('#subject-input').type('テストアイテム２')
      cy.get('#subject-submit').click()
      cy.get('.todo-subject')
        .should('have.length', 2)
        .and((el) => {
          expect(el.get(0).value).to.eq('テストアイテム１')
          expect(el.get(1).value).to.eq('テストアイテム２')
        })
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
          expect(storageData.todo.items[1].subject).to.eq('テストアイテム２')
        })

      // Drag and Drop
      cy.get('.drag-icon').first().as('sourceItem')
      cy.get('.drag-icon').last().as('targetItem')
      cy.get('@sourceItem')
        .trigger('pointerdown', { which: 1, button: 0 })
        .trigger('dragstart')
      cy.get('@targetItem')
        .trigger('dragover')
        .trigger('drop')

      cy.get('.todo-subject')
        .should('have.length', 2)
        .and((el) => {
          expect(el.get(0).value).to.eq('テストアイテム２')
          expect(el.get(1).value).to.eq('テストアイテム１')
        })
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム２')
          expect(storageData.todo.items[1].subject).to.eq('テストアイテム１')
        })
    })

    it('removes a ToDo item', () => {
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('.todo-subject').should('have.value', 'テストアイテム１')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
        })
      cy.get('.todo-remove').click()
      cy.get('.todo-subject').should('not.have.value', 'テストアイテム１')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items).to.have.lengthOf(0)
        })
    })
  })

  describe('Logout operation test', () => {
    beforeEach(() => {
      cy.setTokenCookie()
      cy.visit('/todo')
    })

    it('moves to "Home" page and unsets auth token cookie when logging out via navigation menu', () => {
      cy.getCookie('PtExampleToken')
        .should('exist')
        .and((cookieData) => {
          const cookieValue = JSON.parse(decodeURI(cookieData.value))
          expect(cookieValue.auth.token).to.eq('dummy-token')
        })
      cy.get('#nav-logout-link').click()
      cy.title().should('eq', 'Home | test automation exercise site')
      cy.getCookie('PtExampleToken')
        .should('exist')
        .and((cookieData) => {
          const cookieValue = JSON.parse(decodeURI(cookieData.value))
          expect(cookieValue.auth.token).to.eq('')
        })
    })
  })
})
