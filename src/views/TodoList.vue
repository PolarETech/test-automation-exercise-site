<template>
  <div class="page-base" id="todo-page">
    <section>
      <h1 class="title is-4">
        <!-- should not add new line before title string -->
        <span class="icon pi pi-check-circle"></span>ToDoリスト
      </h1>

      <template v-if="todoItems.length == 0">
        <p class="info-message"
          id="empty-message"
        >
          {{ this.$store.state.message.emptyItem }}
        </p>
      </template>

      <template v-else>
        <draggable
          class="todo-list"
          handle=".todo-drag"
          tag="ul"
          v-model="todoItems"
          item-key="id"
        >
          <template #item="{element}">
            <TodoListItems :item="element" />
          </template>
        </draggable>
      </template>

      <form
        class="add-todo"
        v-show="todoItems.length < 5"
        @submit.prevent="addTodoItem"
      >
        <button
          id="subject-submit"
          type="submit"
          :disabled="isSubmitButtonDisabled"
          aria-label="add new todo item"
        >
          <span class="icon pi pi-plus-circle"></span>
        </button>

        <input
          id="subject-input"
          ref="subjectInput"
          type="text"
          maxlength="15"
          autocomplete="off"
          :placeholder="this.$store.state.message.requireImputTodo"
          v-model="subject"
          aria-label="input new todo item subject"
        />
      </form>

      <p id="item-count">登録件数：{{ todoItems.length }} / 5 件</p>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { useHead } from '@vueuse/head'
import draggable from 'vuedraggable'
import TodoListItems from '@/components/TodoListItems.vue'

// import { configureCompat } from 'vue'
// configureCompat({
//   COMPONENT_V_MODEL: false,
//   RENDER_FUNCTION: false
// })

export default {
  name: 'TodoList',
  components: {
    TodoListItems,
    draggable
  },
  data () {
    return {
      subject: ''
    }
  },
  setup () {
    useHead({
      title: 'TodoList | test automation exercise site'
    })
  },
  methods: {
    ...mapActions({
      addTodoItem (dispatch) {
        if (this.subject.length > 0) {
          dispatch('todo/ADD_TODO_ITEM', this.subject)
          this.subject = ''
          this.$refs.subjectInput.focus()
        }
      }
    })
  },
  computed: {
    todoItems: {
      get () {
        return this.$store.getters['todo/GET_TODO_ITEMS']
      },
      set (todoItems) {
        this.$store.dispatch('todo/SET_TODO_ITEMS', todoItems)
      }
    },
    isSubmitButtonDisabled () {
      return this.subject.length === 0 ? true : null
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
  background-color: $color-page-back;
}
section {
  width: 19rem;
  margin: 0 auto;
  text-align: center;
}
:deep(.p-component) {
  font-family: $font-set;
}
h1.title.is-4 {
  margin: 0;
  padding: 0.8rem 0;
  color: $color-accent;
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
      color: $color-accent;
      font-size: 1.2rem;
      transition: 0.2s ease-in-out;
    }
    &:disabled .icon {
      color: $color-disabled-object;
    }
  }
  input[type="text"] {
    width: 14rem;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid $color-editable-object;
    border-left: 0;
    border-radius: 0;
    background-color: inherit;
    font-size: 0.8rem;
    vertical-align: middle;
    transition: 0.2s ease-in-out;
    &:focus {
      border-bottom: 1px solid $color-accent;
      outline: 0;
      background-color: $color-page-light;
    }
  }
}
#item-count {
  font-size: small;
}
</style>
