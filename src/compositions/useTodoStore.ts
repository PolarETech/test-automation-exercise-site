import { ref, computed } from 'vue'
import { useStore } from '@/store'
import { TodoItem } from '@/types/store'

export const useTodoStore = () => {
  const store = useStore()

  const subject = ref('')

  const todoItems = computed({
    get: () => store.getters['todo/GET_TODO_ITEMS'],
    set: (value: TodoItem[]) => store.dispatch('todo/SET_TODO_ITEMS', value)
  })

  const countTodoItems = computed(() => todoItems.value.length)
  const isTodoItemEmpty = computed(() => todoItems.value.length === 0)
  const isTodoItemMaximum = computed(() => todoItems.value.length >= 5)

  const addTodoItem = () => {
    if (!isTodoItemMaximum.value && subject.value.length > 0) {
      store.dispatch('todo/ADD_TODO_ITEM', subject.value)
      subject.value = ''
    }
  }

  const updateTodoItem = (item: TodoItem, newSubject: string) => {
    store.dispatch('todo/UPDATE_TODO_ITEM', {
      item,
      newSubject
    })
  }

  const doneTodoItem = (item: TodoItem) => {
    store.dispatch('todo/DONE_TODO_ITEM', item)
  }

  const removeTodoItem = (item: TodoItem) => {
    store.dispatch('todo/REMOVE_TODO_ITEM', item)
  }

  return {
    subject,
    todoItems,
    countTodoItems,
    isTodoItemEmpty,
    isTodoItemMaximum,
    addTodoItem,
    updateTodoItem,
    doneTodoItem,
    removeTodoItem
  }
}
