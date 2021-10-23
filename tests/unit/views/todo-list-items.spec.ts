import { mount, VueWrapper } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import TodoListItems from '@/components/TodoListItems.vue'

const head = createHead()

/**
 * Store Mock Configuration
 */

const dummyItem = {
  id: 0,
  isDone: false,
  timestamp: '2012/03/04 05:06:07',
  subject: 'dummyItem'
}
const dummyRequireMessage = 'dummy-require'

const actions = {
  DONE_TODO_ITEM: jest.fn(),
  UPDATE_TODO_ITEM: jest.fn(),
  REMOVE_TODO_ITEM: jest.fn()
}

const getStoreModule = {
  modules: {
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
        requireInputTodo: dummyRequireMessage
      }
    }
  }
}

jest.mock('@/store', () => ({
  store: null,
  useStore: jest.fn()
}))

require('@/store').useStore.mockReturnValue(
  createStore({
    ...getStoreModule
  })
)

describe('TodoListItems.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof TodoListItems>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('a todo item is registered', () => {
    beforeEach(() => {
      wrapper = mount(TodoListItems, {
        props: {
          item: dummyItem
        },
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    describe('display control', () => {
      test('show "TodoItems" vue', () => {
        expect(wrapper.findComponent(TodoListItems).exists()).toBeTruthy()
        expect(wrapper.vm.doneTodoItem).toBeTruthy()
        expect(wrapper.vm.removeTodoItem).toBeTruthy()
        expect(wrapper.vm.updateTodoItem).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('.todo-check').exists()).toBeTruthy()
        expect(wrapper.find('.todo-subject').exists()).toBeTruthy()
        expect(wrapper.find('.todo-sub-info').exists()).toBeTruthy()
        expect(wrapper.find('.todo-timestamp').exists()).toBeTruthy()
        expect(wrapper.find('.todo-remove').exists()).toBeTruthy()
      })
    })

    describe('item control', () => {
      test('click checkbox', async () => {
        await wrapper.find('.todo-check').trigger('click')
        expect(actions.DONE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItem)
        )
      })

      test('update subject with new string', async () => {
        const newSubject = 'UpdateToDoItem'
        const el = wrapper.find('.todo-subject')
        expect((el.element as HTMLInputElement).value).toBe(dummyItem.subject)

        ;(el.element as HTMLInputElement).value = newSubject
        expect((el.element as HTMLInputElement).value).toBe(newSubject)
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()

        await el.trigger('change')
        expect(actions.UPDATE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            item: dummyItem,
            newSubject
          })
        )
        expect((el.element as HTMLInputElement).value).toBe(newSubject)
      })

      test('update subject with empty string', async () => {
        const newSubject = ''
        const el = wrapper.find('.todo-subject')
        expect((el.element as HTMLInputElement).value).toBe(dummyItem.subject)

        ;(el.element as HTMLInputElement).value = newSubject
        expect((el.element as HTMLInputElement).value).toBe(newSubject)
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()

        await el.trigger('change')
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()
        expect((el.element as HTMLInputElement).value).toBe(dummyItem.subject)
      })

      test('remove item', async () => {
        await wrapper.find('.todo-remove').trigger('click')
        expect(actions.REMOVE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItem)
        )
      })
    })
  })
})
