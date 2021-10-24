
import { computed } from 'vue'
import { useStore } from '@/store'

export const useMessageStore = () => {
  const store = useStore()

  const requireLoginMessage = computed(() => store.state.message.requireLogin)
  const loginErrorMessage = computed(() => store.state.message.loginError)

  const emptyItemMessage = computed(() => store.state.message.emptyItem)
  const requireInputTodoMessage = computed(() => store.state.message.requireInputTodo)

  return {
    requireLoginMessage,
    loginErrorMessage,
    emptyItemMessage,
    requireInputTodoMessage
  }
}
