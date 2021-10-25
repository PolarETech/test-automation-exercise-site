import { useTodoStore } from '@/compositions/useTodoStore'
import { createStore } from 'vuex'

/**
 * Store Mock Configuration
 */

const dummyItem = {
  id: 0,
  isDone: false,
  timestamp: '2012/03/04 05:06:07',
  subject: 'dummyItem'
}

const dummyItems = [
  {
    id: 0,
    isDone: false,
    timestamp: '2012/03/04 05:06:07',
    subject: 'dummyItem1'
  },
  {
    id: 1,
    isDone: true,
    timestamp: '2013/04/05 06:07:08',
    subject: 'dummyItem2'
  }
]

const dummyItemsMaximum = [
  {
    id: 0,
    isDone: false,
    timestamp: '2012/03/04 05:06:07',
    subject: 'dummyItem1'
  },
  {
    id: 1,
    isDone: true,
    timestamp: '2013/04/05 06:07:08',
    subject: 'dummyItem2'
  },
  {
    id: 2,
    isDone: false,
    timestamp: '2014/05/06 07:08:09',
    subject: 'dummyItem3'
  },
  {
    id: 3,
    isDone: true,
    timestamp: '2015/06/07 08:09:10',
    subject: 'dummyItem4'
  },
  {
    id: 4,
    isDone: true,
    timestamp: '2016/07/08 09:10:11',
    subject: 'dummyItem5'
  }
]

const gettersItemRegistered = {
  GET_TODO_ITEMS: jest.fn(() => {
    return [dummyItem]
  })
}

const gettersItemEmpty = {
  GET_TODO_ITEMS: jest.fn(() => {
    return []
  })
}

const gettersItemMaximum = {
  GET_TODO_ITEMS: jest.fn(() => {
    return dummyItemsMaximum
  })
}

const actions = {
  ADD_TODO_ITEM: jest.fn(),
  DONE_TODO_ITEM: jest.fn(),
  UPDATE_TODO_ITEM: jest.fn(),
  REMOVE_TODO_ITEM: jest.fn(),
  SET_TODO_ITEMS: jest.fn()
}

const getStoreModuleItemRegistered = {
  modules: {
    todo: {
      namespaced: true,
      state: {
        items: [dummyItem]
      },
      getters: gettersItemRegistered,
      actions
    }
  }
}

const getStoreModuleItemEmpty = {
  modules: {
    todo: {
      namespaced: true,
      state: {
        items: []
      },
      getters: gettersItemEmpty,
      actions
    }
  }
}

const getStoreModuleItemMaximum = {
  modules: {
    todo: {
      namespaced: true,
      state: {
        items: dummyItemsMaximum
      },
      getters: gettersItemMaximum,
      actions
    }
  }
}

jest.mock('@/store', () => ({
  useStore: jest.fn()
}))

describe('useTodoStore', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('a todo item is registered', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleItemRegistered
        })
      )
    })

    describe('todo items getter ', () => {
      test('call store getter "todo/GET_TODO_ITEMS"', () => {
        const { todoItems } = useTodoStore()
        expect(todoItems.value).toStrictEqual([dummyItem])
        expect(gettersItemRegistered.GET_TODO_ITEMS).toBeCalled()
      })
    })

    describe('todo items setter', () => {
      test('call store action "todo/SET_TODO_ITEMS" with correct args when change todoItems', () => {
        const { todoItems } = useTodoStore()
        todoItems.value = dummyItems
        expect(actions.SET_TODO_ITEMS).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItems)
        )
      })
    })

    describe('computed property', () => {
      test('count the number of registered todo items', () => {
        const { todoItems, countTodoItems } = useTodoStore()
        expect(todoItems.value.length).toBe(1)
        expect(countTodoItems.value).toBe(todoItems.value.length)
      })

      test('check if the todo item is empty.', () => {
        const { todoItems, isTodoItemEmpty } = useTodoStore()
        expect(todoItems.value.length).not.toBe(0)
        expect(isTodoItemEmpty.value).toBeFalsy()
      })

      test('check if the maximum number of todo items have been registered', () => {
        const { todoItems, isTodoItemMaximum } = useTodoStore()
        expect(todoItems.value.length).not.toBe(5)
        expect(isTodoItemMaximum.value).toBeFalsy()
      })
    })

    describe('add an item', () => {
      test('should not call "todo/ADD_TODO_ITEM" when submit with empty subject', () => {
        const { subject, addTodoItem } = useTodoStore()
        subject.value = ''
        addTodoItem()
        expect(actions.ADD_TODO_ITEM).not.toBeCalled()
      })

      test('call store action "todo/ADD_TODO_ITEM" with correct args when submit', () => {
        const { subject, addTodoItem } = useTodoStore()
        const newSubject = 'test'
        subject.value = newSubject
        addTodoItem()
        expect(actions.ADD_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.stringMatching(newSubject)
        )
        expect(subject.value).toBe('')
      })
    })

    test('update an item', async () => {
      const { updateTodoItem } = useTodoStore()
      const newSubject = 'UpdateToDoItem'
      updateTodoItem(dummyItem, newSubject)
      expect(actions.UPDATE_TODO_ITEM).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          item: dummyItem,
          newSubject
        })
      )
    })

    test('done an item', async () => {
      const { doneTodoItem } = useTodoStore()
      doneTodoItem(dummyItem)
      expect(actions.DONE_TODO_ITEM).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(dummyItem)
      )
    })

    test('remove an item', async () => {
      const { removeTodoItem } = useTodoStore()
      removeTodoItem(dummyItem)
      expect(actions.REMOVE_TODO_ITEM).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(dummyItem)
      )
    })
  })

  describe('todo item is empty', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleItemEmpty
        })
      )
    })

    describe('computed property', () => {
      test('count the number of registered todo items', () => {
        const { todoItems, countTodoItems } = useTodoStore()
        expect(todoItems.value.length).toBe(0)
        expect(countTodoItems.value).toBe(todoItems.value.length)
      })

      test('Check if the todo item is empty.', () => {
        const { todoItems, isTodoItemEmpty } = useTodoStore()
        expect(todoItems.value.length).toBe(0)
        expect(isTodoItemEmpty.value).toBeTruthy()
      })
    })
  })

  describe('maximum number of items registered', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleItemMaximum
        })
      )
    })

    describe('computed property', () => {
      test('count the number of registered todo items', () => {
        const { todoItems, countTodoItems } = useTodoStore()
        expect(todoItems.value.length).toBe(5)
        expect(countTodoItems.value).toBe(todoItems.value.length)
      })

      test('check if the maximum number of todo items have been registered', () => {
        const { todoItems, isTodoItemMaximum } = useTodoStore()
        expect(todoItems.value.length).toBe(5)
        expect(isTodoItemMaximum.value).toBeTruthy()
      })
    })

    describe('add an item', () => {
      test('should not call "todo/ADD_TODO_ITEM" when the maximum number of todo items have been registered', () => {
        const { subject, addTodoItem } = useTodoStore()
        const newSubject = 'test'
        subject.value = newSubject
        addTodoItem()
        expect(actions.ADD_TODO_ITEM).not.toBeCalled()
      })
    })
  })
})
