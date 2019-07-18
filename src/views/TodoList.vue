<template>
  <div class="todo">
    <section>
      <h1 class="title is-4">
        <b-icon icon="check-circle"></b-icon>
        ToDoリスト
      </h1>

      <p id="empty-message" v-if="items.length == 0">
        {{ this.$store.state.message.emptyItem }}
      </p>

      <draggable class="todo-list" element="ul" :options="{ handle: '#drag-icon' }" v-else>
        <item v-for="item in items" :item="item" :key="item.id" />
      </draggable>

      <form
        class="add-todo"
        v-show="items.length < 5"
        @submit.prevent="addTodoItem"
      >
        <button
          class="register-subject"
          type="submit"
          :disabled="subject.length == 0"
        >
          <b-icon icon="plus-box" type="is-small"></b-icon>
        </button>

        <input
          class="input-subject"
          type="text"
          maxlength="15"
          v-model="subject"
          :placeholder="this.$store.state.message.requireImputTodo"
        />
      </form>

      <p id="item-count">登録件数：{{ items.length }} / 5 件</p>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import { GET_TODO_ITEMS } from '@/store/mutation-types'
import TodoListItems from '@/components/TodoListItems.vue'

export default {
  name: 'TodoList',
  components: {
    item: TodoListItems,
    draggable
  },
  data () {
    return {
      subject: ''
    }
  },
  methods: {
    ...mapActions({
      addTodoItem (dispatch) {
        if (this.subject.length > 0) {
          dispatch('todo/ADD_TODO_ITEM', this.subject)
          this.subject = ''
        }
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

<style lang="scss" scoped>
.todo {
  min-height: 100vh;
  overflow: hidden;
  background-color: #f4efef;
}
section {
  width: 19rem;
  margin: 0 auto;
  text-align: center;
}
h1.title.is-4 {
  margin: 0;
  padding: 0.8rem 0;
  color: #01653d;
  .icon {
    margin-right: 0.3rem;
  }
}
ul {
  margin: 1rem auto;
  text-align: left;
}
form {
  margin: 2rem auto 1rem;
  .register-subject {
    margin: 0 0.5rem 0 0;
    padding: 0;
    transform: scale(1.0);
    border: none;
    background-color: inherit;
    vertical-align: middle;
    .icon {
      color: #01653d;
      transition: 0.2s ease-in-out;
    }
    &:disabled .icon {
      color: lightgray;
    }
  }
  input[type="text"] {
    width: 14rem;
    border-top: none;
    border-right: none;
    border-bottom: 1px solid darkgray;
    border-left: none;
    border-radius: 0;
    background-color: inherit;
    font-size: 0.8rem;
    vertical-align: middle;
    transition: 0.2s ease-in-out;
    &:focus {
      border-bottom: 1px solid #01653d;
      outline: 0;
      background-color: #f8f4f4;
    }
  }
}
#item-count {
  font-size: small;
}
</style>
