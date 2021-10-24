import { ref, computed } from 'vue'
import { useStore } from '@/store'

export const useAuthStore = () => {
  const store = useStore()

  const userId = ref('')
  const password = ref('')
  const isLoginProcessing = ref(false)

  const isLoggedIn = computed(() => store.getters['auth/GET_LOGIN_STATUS'])

  const isLoginUserError = computed(() => {
    return store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']
  })

  const login = async (): Promise<boolean> => {
    isLoginProcessing.value = true
    const user = { userId: userId.value, password: password.value }
    const res = await store.dispatch('auth/LOGIN', user)
    isLoginProcessing.value = false
    return res
  }

  const logout = () => {
    store.dispatch('auth/LOGOUT')
  }

  const resetLoginUserErrorStatus = () => {
    store.dispatch('auth/RESET_LOGIN_USER_ERROR_STATUS')
  }

  return {
    userId,
    password,
    isLoginProcessing,
    isLoggedIn,
    isLoginUserError,
    login,
    logout,
    resetLoginUserErrorStatus
  }
}
