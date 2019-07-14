import dayjs from 'dayjs'
import {
  ADD_TODO_ITEM,
  DONE_TODO_ITEM,
  UPDATE_TODO_ITEM,
  REMOVE_TODO_ITEM,
  GET_TODO_ITEMS
} from '@/store/mutation-types'

export default {
  namespaced: true,
  state: {
    items: [
      // sample
      // { id: 0, isDone: false, timestamp: '2012/03/04 05:06:07', subject: 'dummyItem' }
    ]
  },
  mutations: {
    [ADD_TODO_ITEM]: (state, payload) => {
      state.items.push(payload.item)
    },
    [DONE_TODO_ITEM]: (state, payload) => {
      payload.item.isDone = !payload.item.isDone
      payload.item.timestamp = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')
    },
    [UPDATE_TODO_ITEM]: (state, payload) => {
      payload.item.subject = payload.newSubject
    },
    [REMOVE_TODO_ITEM]: (state, payload) => {
      state.items = state.items.filter((item) =>
        item !== payload.item
      )
    }
  },
  getters: {
    [GET_TODO_ITEMS]: (state) => {
      return state.items
    }
  },
  actions: {
    [ADD_TODO_ITEM]: ({ commit }, subject) => {
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
    [DONE_TODO_ITEM]: ({ commit }, item) => {
      commit(DONE_TODO_ITEM, {
        item
      })
    },
    [UPDATE_TODO_ITEM]: ({ commit }, data) => {
      commit(UPDATE_TODO_ITEM, {
        item: data.item,
        newSubject: data.newSubject
      })
    },
    [REMOVE_TODO_ITEM]: ({ commit }, item) => {
      commit(REMOVE_TODO_ITEM, {
        item
      })
    }
  }
}
