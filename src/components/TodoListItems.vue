<template>
  <li :class="{ is_done: item.isDone }">
    <input
      class="check_todo"
      type="checkbox"
      v-model="item.isDone"
      @click="DONE_TODO_ITEM(item)"
    />

    <input
      class="subject_todo"
      type="text"
      maxlength="15"
      :value="item.subject"
      :placeholder="this.$store.state.message.requireImputTodo"
      @change="updateTodoItem(item, $event)"
    />

    <button class="remove_todo" @click="REMOVE_TODO_ITEM(item)">
      削除
    </button>

    <div class="timestamp_todo">
      <span>チェック更新日時：{{ item.timestamp }}</span>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import { DONE_TODO_ITEM, REMOVE_TODO_ITEM } from '@/store/mutation-types'

export default {
  name: 'TodoListItems',
  props: {
    item: {
      id: Number,
      isDone: Boolean,
      timestamp: String,
      subject: String
    }
  },
  methods: {
    ...mapActions('todo', {
      DONE_TODO_ITEM,
      REMOVE_TODO_ITEM,
      updateTodoItem (dispatch, item, e) {
        const newSubject = e.target.value
        if (newSubject.length > 0) {
          dispatch('UPDATE_TODO_ITEM', {
            item,
            newSubject
          })
        } else {
          // Restore the original string if inpur value is empty
          e.target.value = item.subject
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
li {
  margin-bottom: 1rem;
  list-style-type: none;
}
li.is_done {
  color: gray;
}
</style>
