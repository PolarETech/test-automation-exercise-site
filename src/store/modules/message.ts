import { MessageState } from '@/types/store'

export default {
  namespaced: true,
  state: {
    requireLogin: 'ログインが必要です',
    loginError: 'ログインエラー<br>ユーザーIDまたはパスワードが違います',
    emptyItem: 'ToDoは登録されていません',
    requireInputTodo: 'ToDoの件名を入力してください'
  } as MessageState
}
