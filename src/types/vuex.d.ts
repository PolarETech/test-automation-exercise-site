// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { AuthState, TodoItems, MessageState } from '@/types/store'

declare module '@vue/runtime-core' {
  interface State {
    auth: AuthState
    todo: TodoItems
    message: MessageState
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
