import { mount, VueWrapper } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import TodoList from '@/views/TodoList.vue'

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

const actions = {
  ADD_TODO_ITEM: jest.fn(),
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
    },
    message: {
      namespaced: true,
      state: {
        emptyItem: dummyEmptyMessage,
        requireInputTodo: dummyRequireMessage
      }
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
    },
    message: {
      namespaced: true,
      state: {
        emptyItem: dummyEmptyMessage,
        requireInputTodo: dummyRequireMessage
      }
    }
  }
}

jest.mock('@/store', () => ({
  store: null,
  useStore: jest.fn()
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@/store').useStore.mockReturnValue(
  createStore({
    ...getStoreModuleItemRegistered
  })
)

describe('TodoList.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof TodoList>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('a todo item is registered', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleItemRegistered
        })
      )

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
        expect(gettersItemRegistered.GET_TODO_ITEMS).toBeCalled()
        const el = wrapper.find('#empty-message')
        expect(el.exists()).toBeFalsy()
      })

      test('show "todo-list"', () => {
        expect(gettersItemRegistered.GET_TODO_ITEMS).toBeCalled()
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

    describe('add todo control', () => {
      test('should not call "todo/ADD_TODO_ITEM" when submit with empty subject', async () => {
        const el = wrapper.find('#subject-input')
        const newSubject = ''
        await el.setValue(newSubject)
        await wrapper.find('.add-todo').trigger('submit.prevent')
        expect(actions.ADD_TODO_ITEM).not.toBeCalled()
      })

      test('call store action "todo/ADD_TODO_ITEM" with correct args when submit', async () => {
        const el = wrapper.find('#subject-input')
        const newSubject = 'test'
        await el.setValue(newSubject)
        await wrapper.find('.add-todo').trigger('submit.prevent')
        expect(actions.ADD_TODO_ITEM).toBeCalledWith(
          expect.anything(),
          expect.stringMatching(newSubject)
        )
        expect((el.element as HTMLInputElement).value).toBe('')
      })
    })

    describe('set todo control', () => {
      test('call store action "todo/SET_TODO_ITEMS" with correct args when change todoItems', async () => {
        wrapper.vm.todoItems = dummyItems
        expect(actions.SET_TODO_ITEMS).toBeCalledWith(
          expect.anything(),
          expect.objectContaining(dummyItems)
        )
      })
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
      expect(gettersItemEmpty.GET_TODO_ITEMS).toBeCalled()
      const el = wrapper.find('#empty-message')
      expect(el.exists()).toBeTruthy()
    })

    test('hide "todo-list"', () => {
      expect(gettersItemEmpty.GET_TODO_ITEMS).toBeCalled()
      const el = wrapper.find('.todo-list')
      expect(el.exists()).toBeFalsy()
    })
  })
})
