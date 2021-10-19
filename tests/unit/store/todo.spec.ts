import { createStore, Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { cloneDeep } from 'lodash'
import todo from '@/store/modules/todo'
import { TodoItem } from '@/types/store'

const testItem = {
  id: 88888888,
  isDone: false,
  subject: 'TestToDoItem',
  timestamp: '1234/05/06 07:08:09'
}

const testItems = [
  {
    id: 88888888,
    isDone: false,
    timestamp: '1234/05/06 07:08:09',
    subject: 'TestToDoItem1'
  },
  {
    id: 99999999,
    isDone: true,
    timestamp: '2345/06/07 08:09:10',
    subject: 'TestToDoItem2'
  }
]

const initStore = () => ({
  modules: cloneDeep({ todo })
})

describe('todo', () => {
  let store: Store<State>
  let item: TodoItem
  let itemIndex: number

  beforeEach(() => {
    store = createStore(initStore())
  })

  describe('commit', () => {
    beforeEach(() => {
      const addÎtem = cloneDeep(testItem)
      store.commit('todo/ADD_TODO_ITEM', { item: addÎtem })
      itemIndex = store.state.todo.items.length - 1
      item = store.state.todo.items[itemIndex]
    })

    test('ADD_TODO_ITEM', () => {
      expect(item).toEqual(testItem)
    })

    test('DONE_TODO_ITEM', () => {
      const timestamp = testItem.timestamp
      expect(item.isDone).toBeFalsy()
      expect(item.timestamp).toBe(timestamp)

      // TEST: change item.isDone false -> true and update item.timestamp
      store.commit('todo/DONE_TODO_ITEM', { item })
      expect(item.isDone).toBeTruthy()
      expect(item.timestamp).not.toBe(timestamp)

      // TEST: change item.isDone true -> false
      // timestamp test is omitted to reduce the test execution time.
      store.commit('todo/DONE_TODO_ITEM', { item })
      expect(item.isDone).toBeFalsy()
    })

    test('UPDATE_TODO_ITEM', () => {
      const subject = testItem.subject
      const newSubject = 'UpdateToDoItem'
      expect(item.subject).toBe(subject)
      store.commit('todo/UPDATE_TODO_ITEM', { item, newSubject })
      expect(item.subject).toBe(newSubject)
    })

    test('REMOVE_TODO_ITEM', () => {
      expect(item).toEqual(testItem)
      store.commit('todo/REMOVE_TODO_ITEM', { item })
      expect(store.state.todo.items[itemIndex]).toBeUndefined()
    })

    test('SET_TODO_ITEMS', () => {
      const items = cloneDeep(testItems)
      store.commit('todo/SET_TODO_ITEMS', { items })
      expect(store.state.todo.items).toStrictEqual(items)
    })
  })

  describe('getter', () => {
    beforeEach(() => {
      const addItem = cloneDeep(testItem)
      store.commit('todo/ADD_TODO_ITEM', { item: addItem })
    })

    test('GET_TODO_ITEMS', () => {
      const items = store.getters['todo/GET_TODO_ITEMS']
      expect(items.pop()).toEqual(testItem)
    })
  })

  describe('dispatch', () => {
    const subject = testItem.subject

    beforeEach(async () => {
      await store.dispatch('todo/ADD_TODO_ITEM', subject)
      itemIndex = store.state.todo.items.length - 1
      item = store.state.todo.items[itemIndex]
    })

    test('ADD_TODO_ITEM', async () => {
      expect(item.id).toBeTruthy()
      expect(item.isDone).toBeFalsy()
      expect(item.timestamp).toBeTruthy()
      expect(item.subject).toBe(subject)
    })

    test('DONE_TODO_ITEM', async () => {
      const timestamp = item.timestamp
      expect(item.isDone).toBeFalsy()
      // wait 1sec for advance the timestamp of todo item
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(() => true)
        }, 1000)
      })

      // TEST: change item.isDone false -> true and update item.timestamp
      await store.dispatch('todo/DONE_TODO_ITEM', item)
      expect(item.isDone).toBeTruthy()
      expect(item.timestamp).not.toBe(timestamp)

      // TEST: change item.isDone true -> false
      // timestamp test is omitted to reduce the test execution time.
      await store.dispatch('todo/DONE_TODO_ITEM', item)
      expect(item.isDone).toBeFalsy()
    })

    test('UPDATE_TODO_ITEM', async () => {
      const newSubject = 'UpdateToDoItem'
      expect(item.subject).toBe(subject)
      await store.dispatch('todo/UPDATE_TODO_ITEM', { item, newSubject })
      expect(item.subject).toBe(newSubject)
    })

    test('REMOVE_TODO_ITEM', async () => {
      expect(item.subject).toBe(subject)
      await store.dispatch('todo/REMOVE_TODO_ITEM', item)
      expect(store.state.todo.items[itemIndex]).toBeUndefined()
    })

    test('SET_TODO_ITEMS', async () => {
      const items = cloneDeep(testItems)
      await store.dispatch('todo/SET_TODO_ITEMS', items)
      expect(store.state.todo.items).toStrictEqual(items)
    })
  })
})
