import dayjs from 'dayjs'
import {
  ADD_TODO_ITEM,
  DONE_TODO_ITEM,
  UPDATE_TODO_ITEM,
  REMOVE_TODO_ITEM,
  SET_TODO_ITEMS,
  GET_TODO_ITEMS
} from '@/store/mutation-types'

import { TodoItem, TodoItems, Context } from '@/types/store'

export default {
  namespaced: true,
  state: {
    items: [
      // sample
      // { id: 0, isDone: false, timestamp: '2012/03/04 05:06:07', subject: 'dummyItem' }
    ]
  } as TodoItems,
  mutations: {
    [ADD_TODO_ITEM]: (state: TodoItems, payload: { item: TodoItem }): void => {
      state.items.push(payload.item)
    },
    [DONE_TODO_ITEM]: (state: TodoItems, payload: { item: TodoItem }): void => {
      payload.item.isDone = !payload.item.isDone
      payload.item.timestamp = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')
    },
    [UPDATE_TODO_ITEM]: (state: TodoItems, payload: { item: TodoItem, newSubject: string }): void => {
      payload.item.subject = payload.newSubject
    },
    [REMOVE_TODO_ITEM]: (state: TodoItems, payload: { item: TodoItem }): void => {
      state.items = state.items.filter((item: TodoItem) =>
        item !== payload.item
      )
    },
    [SET_TODO_ITEMS]: (state: TodoItems, payload: { items: TodoItem[] }): void => {
      state.items = payload.items
    }
  },
  getters: {
    [GET_TODO_ITEMS]: (state: TodoItems): TodoItem[] => {
      return state.items
    }
  },
  actions: {
    [ADD_TODO_ITEM]: ({ commit }: Context, subject: string): void => {
      const date = new Date()
      const item = {
        id: date.getTime(),
        isDone: false,
        subject,
        timestamp: dayjs(date).format('YYYY/MM/DD HH:mm:ss')
      }
      commit(ADD_TODO_ITEM, {
        item
      })
    },
    [DONE_TODO_ITEM]: ({ commit }: Context, item: TodoItem): void => {
      commit(DONE_TODO_ITEM, {
        item
      })
    },
    [UPDATE_TODO_ITEM]: ({ commit }: Context, data: { item: TodoItem, newSubject: string }): void => {
      commit(UPDATE_TODO_ITEM, {
        item: data.item,
        newSubject: data.newSubject
      })
    },
    [REMOVE_TODO_ITEM]: ({ commit }: Context, item: TodoItem): void => {
      commit(REMOVE_TODO_ITEM, {
        item
      })
    },
    [SET_TODO_ITEMS]: ({ commit }: Context, items: TodoItem[]): void => {
      commit(SET_TODO_ITEMS, {
        items
      })
    }
  }
}
