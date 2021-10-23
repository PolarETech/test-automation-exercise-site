<template>
  <div class="page-base" id="todo-page">
    <section role="main">
      <h1 class="title is-4">
        <!-- should not add new line before title string -->
        <span class="icon pi pi-check-circle"></span>ToDoリスト
      </h1>

      <template v-if="isTodoItemEmpty">
        <p class="info-message" id="empty-message">
          {{ emptyItemMessage }}
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
        v-show="!isTodoItemMaximum"
        @submit.prevent="addTodoItem()"
      >
        <button
          id="subject-submit"
          type="submit"
          aria-label="add new todo item"
          :disabled="isSubmitButtonDisabled"
        >
          <span class="icon pi pi-plus-circle"></span>
        </button>

        <input
          id="subject-input"
          ref="subjectInputElement"
          type="text"
          aria-label="new todo item subject"
          maxlength="15"
          autocomplete="off"
          :placeholder="requireInputTodoMessage"
          v-model="subject"
        />
      </form>

      <p id="item-count">登録件数：{{ todoItems.length }} / 5 件</p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from '@/store'
import { useHead } from '@vueuse/head'
import draggable from 'vuedraggable'
import TodoListItems from '@/components/TodoListItems.vue'
import { TodoItem } from '@/types/store'

export default defineComponent({
  name: 'TodoList',
  components: {
    TodoListItems,
    draggable
  },
  setup () {
    const store = useStore()

    const subject = ref('')
    const subjectInputElement = ref<HTMLInputElement>()

    const todoItems = computed({
      get: () => store.getters['todo/GET_TODO_ITEMS'],
      set: (value: TodoItem[]) => store.dispatch('todo/SET_TODO_ITEMS', value)
    })

    const countTodoItems = computed(() => todoItems.value.length)
    const isTodoItemEmpty = computed(() => todoItems.value.length === 0)
    const isTodoItemMaximum = computed(() => todoItems.value.length >= 5)

    const isSubmitButtonDisabled = computed(() => subject.value.length === 0)

    const emptyItemMessage = computed(() => store.state.message.emptyItem)
    const requireInputTodoMessage = computed(() => store.state.message.requireInputTodo)

    const addTodoItem = () => {
      if (!isTodoItemMaximum.value && subject.value.length > 0) {
        store.dispatch('todo/ADD_TODO_ITEM', subject.value)
        subject.value = '';
        focusSubjectInputElement()
      }
    }

    const focusSubjectInputElement = () => {
      subjectInputElement?.value?.focus()
    }

    useHead({
      title: 'TodoList | test automation exercise site'
    })

    return {
      subject,
      todoItems,
      countTodoItems,
      isTodoItemEmpty,
      isTodoItemMaximum,
      isSubmitButtonDisabled,
      emptyItemMessage,
      requireInputTodoMessage,
      addTodoItem,
      subjectInputElement
    }
  }
})
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
