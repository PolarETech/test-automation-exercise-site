import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Buefy from 'buefy'
import TodoList from '@/views/TodoList.vue'
import flushPromises from 'flush-promises'

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

const dummyEmptyMessage = 'dummy-empty'
const dummyRequireMessage = 'dummy-require'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Buefy)

const todoActions = {
  ADD_TODO_ITEM: jest.fn(),
  SET_TODO_ITEMS: jest.fn()
}

const todoGetters = {
  GET_TODO_ITEMS: jest.fn(() => {
    return [dummyItem]
  })
}

const getModules = {
  todo: {
    namespaced: true,
    state: {
      items: [dummyItem]
    },
    actions: todoActions,
    getters: todoGetters
  },
  message: {
    namespaced: true,
    state: {
      emptyItem: dummyEmptyMessage,
      requireImputTodo: dummyRequireMessage
    }
  }
}

describe('Todo.vue', () => {
  let store
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('a todo item is registered', () => {
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          ...getModules
        }
      })

      wrapper = shallowMount(TodoList, {
        store,
        localVue
      })
    })

    describe('display control', () => {
      test('show "TodoList" vue', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.vm.addTodoItem).toBeTruthy()
      })

      test('hide "empty item" message', () => {
        expect(todoGetters.GET_TODO_ITEMS).toBeCalled()
        const el = wrapper.find('#empty-message')
        expect(el.exists()).toBeFalsy()
      })

      test('show "todo-list"', () => {
        expect(todoGetters.GET_TODO_ITEMS).toBeCalled()
        const el = wrapper.find('.todo-list')
        expect(el.exists()).toBeTruthy()
      })

      test('show "add-todo" elements', () => {
        expect(wrapper.find('.add-todo').exists()).toBeTruthy()
        expect(wrapper.find('#subject-input').exists()).toBeTruthy()
        expect(wrapper.find('#subject-submit').exists()).toBeTruthy()
      })

      test('show "item-count" message with correct number', () => {
        const el = wrapper.find('#item-count')
        expect(el.exists()).toBeTruthy()
        expect(el.text()).toBe('登録件数：1 / 5 件')
      })

      test('disable "register" button before input new subject', () => {
        const submit = wrapper.find('#subject-submit')
        expect(submit.attributes().disabled).toBe('disabled')
      })

      test('enable "register" button when input new subject', () => {
        const submit = wrapper.find('#subject-submit')
        expect(submit.attributes().disabled).toBe('disabled')
        wrapper.find('#subject-input').setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "register" button when clear/input new subject', () => {
        const el = wrapper.find('#subject-input')
        const submit = wrapper.find('#subject-submit')
        el.setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()

        el.setValue('')
        expect(submit.attributes().disabled).toBe('disabled')
        el.setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()
      })
    })

    describe('add todo control', () => {
      test('should not call "todo/ADD_TODO_ITEM" when submit with empty subject', async () => {
        const el = wrapper.find('#subject-input')
        const newSubject = ''
        el.setValue(newSubject)
        wrapper.find('.add-todo').trigger('submit.prevent')
        await flushPromises()
        expect(todoActions.ADD_TODO_ITEM).not.toBeCalled()
      })

      test('call store action "todo/ADD_TODO_ITEM" with correct args when submit', async () => {
        const el = wrapper.find('#subject-input')
        const newSubject = 'test'
        el.setValue(newSubject)
        wrapper.find('.add-todo').trigger('submit.prevent')
        await flushPromises()
        expect(todoActions.ADD_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.stringMatching(newSubject),
          undefined
        )
        expect(el.element.value).toBe('')
      })
    })

    describe('set todo control', () => {
      test('call store action "todo/SET_TODO_ITEMS" with correct args when change items', async () => {
        wrapper.setData({ items: dummyItems })
        await flushPromises()
        expect(todoActions.SET_TODO_ITEMS).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItems),
          undefined
        )
      })
    })
  })

  describe('todo item is empty', () => {
    const localTodoGetters = {
      GET_TODO_ITEMS: jest.fn(() => {
        return []
      })
    }

    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          ...getModules,
          todo: {
            namespaced: true,
            state: {
              items: []
            },
            actions: todoActions,
            getters: localTodoGetters
          }
        }
      })

      wrapper = shallowMount(TodoList, {
        store,
        localVue
      })
    })

    test('show "empty item" message', () => {
      expect(localTodoGetters.GET_TODO_ITEMS).toBeCalled()
      const el = wrapper.find('#empty-message')
      expect(el.exists()).toBeTruthy()
    })

    test('hide "todo-list"', () => {
      expect(localTodoGetters.GET_TODO_ITEMS).toBeCalled()
      const el = wrapper.find('.todo-list')
      expect(el.exists()).toBeFalsy()
    })
  })
})
