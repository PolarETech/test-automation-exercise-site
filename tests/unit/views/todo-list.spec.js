import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoList from '@/views/TodoList.vue'
import flushPromises from 'flush-promises'

const dummyItem = {
  id: 0,
  isDone: false,
  timestamp: '2012/03/04 05:06:07',
  subject: 'dummyItem'
}
const dummyEmptyMessage = 'dummy-empty'
const dummyRequireMessage = 'dummy-require'

const localVue = createLocalVue()
localVue.use(Vuex)

const todoActions = {
  ADD_TODO_ITEM: jest.fn()
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
        const el = wrapper.find('#empty_message')
        expect(el.exists()).toBeFalsy()
      })

      test('show "todo_list"', () => {
        expect(todoGetters.GET_TODO_ITEMS).toBeCalled()
        const el = wrapper.find('.todo_list')
        expect(el.exists()).toBeTruthy()
      })

      test('show "add_todo" elements', () => {
        expect(wrapper.find('.add_todo').exists()).toBeTruthy()
        expect(wrapper.find('.input_subject').exists()).toBeTruthy()
        expect(wrapper.find('.register_subject').exists()).toBeTruthy()
      })

      test('show "item_count" message with correct number', () => {
        const el = wrapper.find('#item_count')
        expect(el.exists()).toBeTruthy()
        expect(el.text()).toBe('登録件数：1 / 5 件')
      })

      test('disable "register" button before input new subject', () => {
        const submit = wrapper.find('.register_subject')
        expect(submit.attributes().disabled).toBe('disabled')
      })

      test('enable "register" button when input new subject', () => {
        const submit = wrapper.find('.register_subject')
        expect(submit.attributes().disabled).toBe('disabled')
        wrapper.find('.input_subject').setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "register" button when clear/input new subject', () => {
        const el = wrapper.find('.input_subject')
        const submit = wrapper.find('.register_subject')
        el.setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()

        el.setValue('')
        expect(submit.attributes().disabled).toBe('disabled')
        el.setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()
      })
    })

    describe('add todo control', () => {
      test('call store action "todo/ADD_TODO_ITEM" with correct args when submit', async () => {
        const el = wrapper.find('.input_subject')
        const newSubject = 'test'
        el.setValue(newSubject)
        wrapper.find('.register_subject').trigger('submit.prevent')
        await flushPromises()
        expect(todoActions.ADD_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.stringMatching(newSubject),
          undefined
        )
        expect(el.element.value).toBe('')
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
      const el = wrapper.find('#empty_message')
      expect(el.exists()).toBeTruthy()
    })

    test('hide "todo_list"', () => {
      expect(localTodoGetters.GET_TODO_ITEMS).toBeCalled()
      const el = wrapper.find('.todo_list')
      expect(el.exists()).toBeFalsy()
    })
  })
})
