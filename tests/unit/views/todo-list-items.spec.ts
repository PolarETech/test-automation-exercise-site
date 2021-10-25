import { mount, VueWrapper } from '@vue/test-utils'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import TodoListItems from '@/components/TodoListItems.vue'

const head = createHead()

/**
 * useTodoStore Mock Configuration
 */

const dummyItem = {
  id: 0,
  isDone: false,
  timestamp: '2012/03/04 05:06:07',
  subject: 'dummyItem'
}

const mockUpdateTodoItem = jest.fn()
const mockDoneTodoItem = jest.fn()
const mockRemoveTodoItem = jest.fn()

const getUseTodoStoreMock = () => ({
  updateTodoItem: mockUpdateTodoItem,
  doneTodoItem: mockDoneTodoItem,
  removeTodoItem: mockRemoveTodoItem
})

jest.mock('@/compositions/useTodoStore', () => ({
  useTodoStore: jest.fn(() => ({
    ...getUseTodoStoreMock()
  }))
}))

/**
 * useMessageStore Mock Configuration
 */

const dummyRequireInputMessage = 'dummy-require-input'

jest.mock('@/compositions/useMessageStore', () => ({
  useMessageStore: jest.fn(() => ({
    requireInputTodoMessage: dummyRequireInputMessage
  }))
}))

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
        expect(wrapper.vm.updateTodoItemSubject).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('.todo-drag').exists()).toBeTruthy()
        expect(wrapper.find('.todo-check').exists()).toBeTruthy()
        expect(wrapper.find('.todo-subject').exists()).toBeTruthy()
        expect(wrapper.find('.todo-subject').attributes().placeholder).toBe(dummyRequireInputMessage)
        expect(wrapper.find('.todo-sub-info').exists()).toBeTruthy()
        expect(wrapper.find('.todo-timestamp').exists()).toBeTruthy()
        expect(wrapper.find('.todo-remove').exists()).toBeTruthy()
      })
    })

    describe('binding control', () => {
      test('todo check bind "item.isDone" property', () => {
        const check = wrapper.find('.todo-check')
        expect((check.element as HTMLInputElement).checked).toBe(dummyItem.isDone)
      })

      test('todo subject bind "item.subject" property', () => {
        const subject = wrapper.find('.todo-subject')
        expect((subject.element as HTMLInputElement).value).toBe(dummyItem.subject)
      })

      test('todo timestamp bind "item.timestamp" property', () => {
        expect(wrapper.find('.todo-timestamp').text()).toBe('確認日時：' + dummyItem.timestamp)
      })
    })

    describe('item control', () => {
      test('click checkbox', async () => {
        await wrapper.find('.todo-check').trigger('click')
        expect(mockDoneTodoItem).toBeCalledWith(dummyItem)
      })

      test('update subject with new string', async () => {
        const newSubject = 'UpdateToDoItem'
        const el = wrapper.find('.todo-subject')
        expect((el.element as HTMLInputElement).value).toBe(dummyItem.subject)

        ;(el.element as HTMLInputElement).value = newSubject
        expect((el.element as HTMLInputElement).value).toBe(newSubject)
        expect(mockUpdateTodoItem).not.toBeCalled()

        await el.trigger('change')
        expect(mockUpdateTodoItem).toBeCalledWith(dummyItem, newSubject)
        expect((el.element as HTMLInputElement).value).toBe(newSubject)
      })

      test('update subject with empty string', async () => {
        const newSubject = ''
        const el = wrapper.find('.todo-subject')
        expect((el.element as HTMLInputElement).value).toBe(dummyItem.subject)

        ;(el.element as HTMLInputElement).value = newSubject
        expect((el.element as HTMLInputElement).value).toBe(newSubject)
        expect(mockUpdateTodoItem).not.toBeCalled()

        await el.trigger('change')
        expect(mockUpdateTodoItem).not.toBeCalled()
        expect((el.element as HTMLInputElement).value).toBe(dummyItem.subject)
      })

      test('remove item', async () => {
        await wrapper.find('.todo-remove').trigger('click')
        expect(mockRemoveTodoItem).toBeCalledWith(dummyItem)
      })
    })
  })
})
