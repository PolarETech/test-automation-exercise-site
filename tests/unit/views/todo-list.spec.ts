import { mount, VueWrapper } from '@vue/test-utils'
import { ref } from '@vue/runtime-core'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import TodoList from '@/views/TodoList.vue'

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

const mockAddTodoItem = jest.fn(() => false)

// NOTE:
// Rewriting of values may occur during test execution.
// For initialization before each test,
// define the mock data as a function that returns the data.
const getUseTodoStoreMockItemRegistered = () => ({
  subject: ref(''),
  todoItems: ref([dummyItem]),
  countTodoItems: 1,
  isTodoItemEmpty: false,
  isTodoItemMaximum: false,
  addTodoItem: mockAddTodoItem
})

const getUseTodoStoreMockItemEmpty = () => ({
  subject: ref(''),
  todoItems: ref([]),
  countTodoItems: 0,
  isTodoItemEmpty: true,
  isTodoItemMaximum: false,
  addTodoItem: mockAddTodoItem
})

const getUseTodoStoreMockItemMaximum = () => ({
  subject: ref(''),
  todoItems: ref(dummyItemsMaximum),
  countTodoItems: 5,
  isTodoItemEmpty: false,
  isTodoItemMaximum: true,
  addTodoItem: mockAddTodoItem
})

jest.mock('@/compositions/useTodoStore', () => ({
  useTodoStore: jest.fn()
}))

/**
 * useMessageStore Mock Configuration
 */

const dummyEmptyMessage = 'dummy-empty'
const dummyRequireInputMessage = 'dummy-require-input'

jest.mock('@/compositions/useMessageStore', () => ({
  useMessageStore: jest.fn(() => ({
    emptyItemMessage: dummyEmptyMessage,
    requireInputTodoMessage: dummyRequireInputMessage
  }))
}))

describe('TodoList.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof TodoList>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('a todo item is registered', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useTodoStore').useTodoStore.mockReturnValue({
        ...getUseTodoStoreMockItemRegistered()
      })

      wrapper = mount(TodoList, {
        attachTo: document.body,
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    describe('display control', () => {
      test('show "TodoList" vue', () => {
        expect(wrapper.findComponent(TodoList).exists()).toBeTruthy()
        expect(wrapper.vm.subjectSubmit).toBeTruthy()
      })

      test('hide "empty item" message', () => {
        const el = wrapper.find('#empty-message')
        expect(el.exists()).toBeFalsy()
      })

      test('show "todo-list"', () => {
        const el = wrapper.find('.todo-list')
        expect(el.exists()).toBeTruthy()
      })

      test('show "add-todo" elements', () => {
        expect(wrapper.find('.add-todo').exists()).toBeTruthy()
        expect(wrapper.find('#subject-input').exists()).toBeTruthy()
        expect(wrapper.find('#subject-input').attributes().placeholder).toBe(dummyRequireInputMessage)
        expect(wrapper.find('#subject-submit').exists()).toBeTruthy()
      })

      test('show "item-count" message with correct number', () => {
        const el = wrapper.find('#item-count')
        expect(el.exists()).toBeTruthy()
        expect(el.text()).toBe('登録件数：1 / 5 件')
      })

      test('disable "register" button before input new subject', () => {
        const submit = wrapper.find('#subject-submit')
        expect(submit.attributes().disabled).toBe('') // WARNING: Suspicious behavior of @vue/test-utils v2.0.0-rc.15
      })

      test('enable "register" button when input new subject', async () => {
        const submit = wrapper.find('#subject-submit')
        expect(submit.attributes().disabled).toBe('') // WARNING: Suspicious behavior of @vue/test-utils v2.0.0-rc.15
        await wrapper.find('#subject-input').setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "register" button when clear/input new subject', async () => {
        const el = wrapper.find('#subject-input')
        const submit = wrapper.find('#subject-submit')
        await el.setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()

        await el.setValue('')
        expect(submit.attributes().disabled).toBe('') // WARNING: Suspicious behavior of @vue/test-utils v2.0.0-rc.15
        await el.setValue('test')
        expect(submit.attributes().disabled).toBeUndefined()
      })
    })

    describe('binding control', () => {
      test('subject input bind "subject" property', async () => {
        const el = wrapper.find('#subject-input')
        const newSubject = 'test'
        await el.setValue(newSubject)
        expect(wrapper.vm.subject).toBe(newSubject)
      })
    })

    describe('add todo control', () => {
      test('call "addTodoItem" when click register button', async () => {
        const el = wrapper.find('#subject-input')
        const newSubject = 'test'
        await el.setValue(newSubject)
        await wrapper.find('.add-todo').trigger('submit.prevent')
        expect(mockAddTodoItem).toBeCalled()
      })
    })
  })

  describe('todo item is empty', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useTodoStore').useTodoStore.mockReturnValue({
        ...getUseTodoStoreMockItemEmpty()
      })

      wrapper = mount(TodoList, {
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    test('show "empty item" message', () => {
      const el = wrapper.find('#empty-message')
      expect(el.exists()).toBeTruthy()
    })

    test('hide "todo-list"', () => {
      const el = wrapper.find('.todo-list')
      expect(el.exists()).toBeFalsy()
    })

    test('show "item-count" message with correct number', () => {
      const el = wrapper.find('#item-count')
      expect(el.exists()).toBeTruthy()
      expect(el.text()).toBe('登録件数：0 / 5 件')
    })
  })

  describe('maximum number of items registered', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useTodoStore').useTodoStore.mockReturnValue({
        ...getUseTodoStoreMockItemMaximum()
      })

      wrapper = mount(TodoList, {
        attachTo: document.body,
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    test('hide "add-todo" elements', () => {
      expect(wrapper.find('.add-todo').isVisible()).toBeFalsy()
      expect(wrapper.find('#subject-input').isVisible()).toBeFalsy()
      expect(wrapper.find('#subject-submit').isVisible()).toBeFalsy()
    })

    test('show "item-count" message with correct number', () => {
      const el = wrapper.find('#item-count')
      expect(el.exists()).toBeTruthy()
      expect(el.text()).toBe('登録件数：5 / 5 件')
    })
  })
})
