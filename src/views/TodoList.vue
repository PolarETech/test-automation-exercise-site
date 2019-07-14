<template>
  <div class="todo">
    <h1>ToDoリスト</h1>

    <p class="message" id="empty_message" v-if="items.length == 0">
      {{ this.$store.state.message.emptyItem }}
    </p>

    <ul class="todo_list" v-else>
      <item v-for="item in items" :item="item" :key="item.id" />
    </ul>

    <form
      class="add_todo"
      v-show="items.length < 5"
      @submit.prevent="addTodoItem"
    >
      <input
        class="input_subject"
        type="text"
        maxlength="15"
        v-model="subject"
        :placeholder="this.$store.state.message.requireImputTodo"
      />

      <button
        class="register_subject"
        type="submit"
        :disabled="subject.length == 0"
      >
        追加
      </button>
    </form>

    <p class="message" id="item_count">登録件数：{{ items.length }} / 5 件</p>

    <hr />
    <button class="logout" @click="logout">ログアウト</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { GET_TODO_ITEMS } from '@/store/mutation-types'
import TodoListItems from '@/components/TodoListItems.vue'

export default {
  name: 'TodoList',
  components: {
    item: TodoListItems
  },
  data () {
    return {
      subject: ''
    }
  },
  methods: {
    ...mapActions({
      addTodoItem (dispatch) {
        dispatch('todo/ADD_TODO_ITEM', this.subject)
        this.subject = ''
      },
      async logout (dispatch) {
        dispatch('auth/LOGOUT')
        this.$router.push('/')
      }
    })
  },
  computed: {
    ...mapGetters('todo', {
      items: GET_TODO_ITEMS
    })
  }
}
</script>
