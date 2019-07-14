import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoListItems from '@/components/TodoListItems.vue'
import flushPromises from 'flush-promises'

const dummyItem = {
  id: 0,
  isDone: false,
  timestamp: '2012/03/04 05:06:07',
  subject: 'dummyItem'
}
const dummyRequireMessage = 'dummy-require'

const localVue = createLocalVue()
localVue.use(Vuex)

const actions = {
  DONE_TODO_ITEM: jest.fn(),
  UPDATE_TODO_ITEM: jest.fn(),
  REMOVE_TODO_ITEM: jest.fn()
}

const getModules = {
  todo: {
    namespaced: true,
    state: {
      items: [dummyItem]
    },
    actions
  },
  message: {
    namespaced: true,
    state: {
      requireImputTodo: dummyRequireMessage
    }
  }
}

describe('TodoItems.vue', () => {
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

      wrapper = shallowMount(TodoListItems, {
        store,
        propsData: {
          item: dummyItem
        },
        localVue
      })
    })

    describe('display control', () => {
      test('show "TodoItems" vue', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.vm.updateTodoItem).toBeTruthy()
        expect(wrapper.vm.DONE_TODO_ITEM).toBeTruthy()
        expect(wrapper.vm.REMOVE_TODO_ITEM).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('.check_todo').exists()).toBeTruthy()
        expect(wrapper.find('.subject_todo').exists()).toBeTruthy()
        expect(wrapper.find('.remove_todo').exists()).toBeTruthy()
        expect(wrapper.find('.timestamp_todo').exists()).toBeTruthy()
      })
    })

    describe('item control', () => {
      test('click checkbox', async () => {
        wrapper.find('.check_todo').trigger('click')
        await flushPromises()
        expect(actions.DONE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItem),
          undefined
        )
      })

      test('update subject with new string', async () => {
        const newSubject = 'UpdateToDoItem'
        const el = wrapper.find('.subject_todo')
        expect(el.element.value).toBe(dummyItem.subject)

        el.setValue(newSubject)
        expect(el.element.value).toBe(newSubject)
        await flushPromises()
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()

        el.trigger('change')
        await flushPromises()
        expect(actions.UPDATE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            item: dummyItem,
            newSubject
          }),
          undefined
        )
        expect(el.element.value).toBe(newSubject)
      })

      test('update subject with empty string', async () => {
        const newSubject = ''
        const el = wrapper.find('.subject_todo')
        expect(el.element.value).toBe(dummyItem.subject)

        el.setValue(newSubject)
        expect(el.element.value).toBe(newSubject)
        await flushPromises()
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()

        el.trigger('change')
        await flushPromises()
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()
        expect(el.element.value).toBe(dummyItem.subject)
      })

      test('remove item', async () => {
        wrapper.find('.remove_todo').trigger('click')
        await flushPromises()
        expect(actions.REMOVE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItem),
          undefined
        )
      })
    })
  })
})
