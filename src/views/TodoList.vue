<template>
  <div class="page-base" id="todo-page">
    <section>
      <h1 class="title is-4">
        <!-- should not add new line before title string -->
        <b-icon icon="check-circle"></b-icon>ToDoリスト
      </h1>

      <p class="info-message" id="empty-message" v-if="items.length == 0">
        {{ this.$store.state.message.emptyItem }}
      </p>

      <draggable class="todo-list" tag="ul" v-model="items" handle=".drag-icon" v-else>
        <item v-for="item in items" :item="item" :key="item.id" />
      </draggable>

      <form
        class="add-todo"
        v-show="items.length < 5"
        @submit.prevent="addTodoItem"
      >
        <button
          id="subject-submit"
          type="submit"
          :disabled="subject.length == 0"
        >
          <b-icon icon="plus-box" type="is-small"></b-icon>
        </button>

        <input
          id="subject-input"
          type="text"
          maxlength="15"
          autocomplete="off"
          v-model="subject"
          :placeholder="this.$store.state.message.requireImputTodo"
        />
      </form>

      <p id="item-count">登録件数：{{ items.length }} / 5 件</p>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
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
  head: {
    title: {
      inner: 'TodoList'
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
    items: {
      get () {
        return this.$store.getters['todo/GET_TODO_ITEMS']
      },
      set (items) {
        this.$store.dispatch('todo/SET_TODO_ITEMS', items)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-base {
  min-height: 100vh;
  overflow: hidden;
}
#todo-page {
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
  #subject-submit {
    margin: 0 0.5rem 0 0;
    padding: 0;
    transform: scale(1.0);
    border: 0;
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
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid darkgray;
    border-left: 0;
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
