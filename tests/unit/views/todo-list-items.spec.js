import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import TodoListItems from '@/components/TodoListItems.vue'

const head = createHead()

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

describe('TodoListItems.vue', () => {
  let store
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('a todo item is registered', () => {
    beforeEach(() => {
      store = createStore({
        modules: {
          ...getModules
        }
      })

      wrapper = mount(TodoListItems, {
        props: {
          item: dummyItem
        },
        global: {
          plugins: [
            store,
            head,
            PrimeVue
          ]
        }
      })
    })

    describe('display control', () => {
      test('show "TodoItems" vue', () => {
        expect(wrapper.findComponent(TodoListItems).exists()).toBeTruthy()
        expect(wrapper.vm.updateTodoItem).toBeTruthy()
        expect(wrapper.vm.DONE_TODO_ITEM).toBeTruthy()
        expect(wrapper.vm.REMOVE_TODO_ITEM).toBeTruthy()
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
        expect(el.element.value).toBe(dummyItem.subject)

        // NOTE:
        //   onChange event is triggered by textInput.setValue() method at @vue/test-utils v2.0.0-rc.15.
        //   In previous version, onChange event was not triggered in the same situation.
        //   So I rewrote the method to directly assign value,
        //   since I cannot confirm that the action is not called during text input.

        // await el.setValue(newSubject)
        el.element.value = newSubject
        expect(el.element.value).toBe(newSubject)
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()

        await el.trigger('change')
        expect(actions.UPDATE_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            item: dummyItem,
            newSubject
          })
        )
        expect(el.element.value).toBe(newSubject)
      })

      test('update subject with empty string', async () => {
        const newSubject = ''
        const el = wrapper.find('.todo-subject')
        expect(el.element.value).toBe(dummyItem.subject)

        // NOTE:
        //   onChange event is triggered by textInput.setValue() method at @vue/test-utils v2.0.0-rc.15.
        //   In previous version, onChange event was not triggered in the same situation.
        //   Due to this behavior change, the set empty string is immediately restored to the original strings.
        //   So I rewrote the method to assign value directly,
        //   since I cannot confirm that the empty string was entered correctly once.

        // await el.setValue(newSubject)
        el.element.value = newSubject
        expect(el.element.value).toBe(newSubject)
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()

        await el.trigger('change')
        expect(actions.UPDATE_TODO_ITEM).not.toBeCalled()
        expect(el.element.value).toBe(dummyItem.subject)
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
