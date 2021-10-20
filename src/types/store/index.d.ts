import { Commit } from 'vuex'

export type AuthState = {
  token: string,
  userError: boolean
}

export type TodoItem = {
  id: number,
  isDone: boolean,
  timestamp: string,
  subject: string
}

export type TodoItems = {
  items: TodoItem[]
}

export type MessageState = {
  requireLogin: string,
  loginError: string,
  emptyItem: string,
  requireInputTodo: string
}

export type Context = {
  commit: Commit
}
