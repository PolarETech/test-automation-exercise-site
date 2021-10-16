import dayjs from 'dayjs'

describe('TodoList view test', () => {
  beforeEach(() => {
    cy.setTokenCookie()
    cy.visit('/todo')
  })

  it('displays "TodoList" page', () => {
    cy.title().should('eq', 'TodoList | test automation exercise site')
    cy.get('header .navbar').should('be.visible')
    cy.get('h1').should('contain', 'ToDoリスト')
    cy.get('#empty-message')
      .should('be.visible')
      .and('contain', 'ToDoは登録されていません')
    cy.get('.todo-list').should('not.exist')
    cy.get('button#subject-submit')
      .should('be.visible')
      .and('be.disabled')
    cy.get('input#subject-input').should('be.visible')
    cy.get('#item-count').should('contain', '登録件数：0 / 5 件')
    cy.contains('footer', '© 2019 Polar Tech').should('be.visible')
  })

  it('adds a ToDo item', () => {
    // omit HH:mm:ss confirmation in timestamp because it is difficult to match the time in seconds
    const date = dayjs(new Date()).format('YYYY/MM/DD')
    cy.get('#subject-input').type('テストアイテム１')
    cy.get('#subject-submit')
      .should('not.be.disabled')
      .click()
    cy.get('#empty-message').should('not.exist')
    cy.get('.todo-list').should('be.visible')
    cy.get('.todo-drag').should('be.visible')
    cy.get('.todo-check').should('not.be.checked')
    cy.get('.todo-timestamp').should('contain', date)
    cy.get('.todo-remove').should('be.visible')
    cy.get('.todo-subject').should('have.value', 'テストアイテム１')
    cy.get('#item-count').should('contain', '登録件数：1 / 5 件')
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
    cy.get('.todo-drag').first().as('sourceItem')
    cy.get('.todo-drag').last().as('targetItem')
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

  it('removes a ToDo item and the list is empty', () => {
    cy.get('#subject-input').type('テストアイテム１')
    cy.get('#subject-submit').click()
    cy.get('.todo-subject').should('have.value', 'テストアイテム１')
      .then(() => {
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
      })
    cy.get('.todo-remove').click()
    cy.get('.todo-list').should('not.exist')
      .then(() => {
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items).to.have.lengthOf(0)
      })
    cy.get('#empty-message')
      .should('be.visible')
      .and('contain', 'ToDoは登録されていません')
  })

  it('removes a ToDo item and another ToDo item remains in the list', () => {
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

    cy.get('.todo-remove').first().click()
    cy.get('.todo-subject')
      .should('have.length', 1)
      .and((el) => {
        expect(el.get(0).value).to.eq('テストアイテム２')
      })
      .then(() => {
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].subject).to.eq('テストアイテム２')
      })
    cy.get('#empty-message').should('not.exist')
  })

  it('stores a ToDo item after logging out/in', () => {
    cy.get('#subject-input').type('テストアイテム１')
    cy.get('#subject-submit').click()
    cy.get('.todo-subject').should('have.value', 'テストアイテム１')
    cy.get('.todo-check+label').click()
    cy.get('.todo-check').should('be.checked')
      .then(() => {
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].isDone).to.eq(true)
        expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
      })

    cy.contains('a', 'Logout').click()
    cy.contains('a', 'TodoList').click()
    cy.get('input[type=text]').type('testID')
    cy.get('input[type=password]').type('testPASS')
    cy.contains('button', 'ログイン').click()

    cy.get('.todo-check').should('be.checked')
    cy.get('.todo-subject').should('have.value', 'テストアイテム１')
      .then(() => {
        const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
        expect(storageData.todo.items[0].isDone).to.eq(true)
        expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
      })
  })

  context('subject variation', () => {
    it('adds the ToDo item which has maximum number of characters', () => {
      cy.get('#subject-input')
        .type('1234567890ABCDE')
      cy.get('form.add-todo').submit()
      cy.get('.todo-subject').should('have.value', '1234567890ABCDE')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].isDone).to.eq(false)
          expect(storageData.todo.items[0].subject).to.eq('1234567890ABCDE')
        })
    })

    it('tries to add the ToDo item which has exceeded the number of characters', () => {
      cy.get('#subject-input')
        .type('1234567890ABCDEF')
      cy.get('form.add-todo').submit()
      cy.get('.todo-subject').should('have.value', '1234567890ABCDE')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].isDone).to.eq(false)
          expect(storageData.todo.items[0].subject).to.eq('1234567890ABCDE')
        })
    })

    it('adds the ToDo item which has each character type', () => {
      const patterns = [
        'ア１a!"\',./:;=?\\',
        'あA　ヲンヰヱ<a>ヴーヾ・',
        'ａ1"＠ ｧｰｭ","ｿﾏﾞﾟ',
        'Ａｱ@&lt;(&copy;)',
        '亜,\'&amp;㈱£𠀋表\'',
        '<span>🍺</span>'
      ]

      patterns.forEach(str => {
        cy.get('#subject-input').type(str)
        cy.get('#subject-submit').click()
        cy.get('.todo-subject').should('have.value', str)
          .then(() => {
            const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
            expect(storageData.todo.items[0].subject).to.eq(str)
          })
        cy.get('.todo-remove').click()
        cy.get('.todo-list').should('not.exist')
      })
    })

    it('adds maximum number of Todo items', () => {
      for (let i = 1; i < 6; i++) {
        cy.get('#subject-input').type(`テストアイテム${i}`)
        cy.get('#subject-submit').click()
        cy.get('#item-count').should('contain', `登録件数：${i} / 5 件`)
      }
      cy.get('button#subject-submit').should('not.be.visible')
      cy.get('input#subject-input').should('not.be.visible')
      cy.get('.todo-subject')
        .should('have.length', 5)
        .and((el) => {
          for (let i = 1; i < 6; i++) {
            expect(el.get(i - 1).value).to.eq(`テストアイテム${i}`)
          }
        })
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          for (let i = 1; i < 6; i++) {
            expect(storageData.todo.items[i - 1].subject).to.eq(`テストアイテム${i}`)
          }
        })
    })

    it('tries to change a ToDo item subject to empty', () => {
      cy.get('#subject-input').type('テストアイテム１')
      cy.get('#subject-submit').click()
      cy.get('.todo-subject').should('have.value', 'テストアイテム１')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
        })
      cy.get('.todo-subject').clear().blur()
        // should be restored the original subject
        .should('have.value', 'テストアイテム１')
        .then(() => {
          const storageData = JSON.parse(localStorage.getItem('PtExampleTodos'))
          expect(storageData.todo.items[0].subject).to.eq('テストアイテム１')
        })
    })
  })
})
