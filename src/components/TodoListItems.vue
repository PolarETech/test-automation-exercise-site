<template>
  <li :class="{ is_done: item.isDone }" :id="String(item.id)">
    <button
      class="todo-drag"
      :id="'dg-' + item.id"
      aria-label="drag to reorder todo items"
    >
      <span class="icon pi pi-ellipsis-v drag-icon"></span>
      <span class="icon pi pi-ellipsis-v drag-icon"></span>
    </button>

    <input
      class="todo-check"
      :id="'cb-' + item.id"
      type="checkbox"
      :checked="item.isDone"
      @click="doneTodoItem(item)"
    />
    <label :for="'cb-' + item.id" :aria-label="item.subject"></label>

    <input
      class="todo-subject"
      :id="'sj-' + item.id"
      type="text"
      maxlength="15"
      :placeholder="requireInputTodoMessage"
      :value="item.subject"
      @change="updateTodoItem(item, $event)"
    />

    <div class="todo-sub-info">
      <span class="todo-timestamp" :id="'ts-' + item.id">確認日時：{{ item.timestamp }}</span>

      <button
        class="todo-remove"
        :id="'rm-' + item.id"
        aria-label="delete the todo item"
        @click="removeTodoItem(item)"
      >
        <span class="icon pi pi-trash remove-icon"></span>
      </button>
    </div>

  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TodoItem } from '@/types/store'

export default defineComponent({
  name: 'TodoListItems',
  props: {
    item: {
      type: Object as PropType<TodoItem>,
      required: true
    }
  },
  methods: {
    doneTodoItem (item: TodoItem) {
      this.$store.dispatch('todo/DONE_TODO_ITEM', item)
    },
    removeTodoItem (item: TodoItem) {
      this.$store.dispatch('todo/REMOVE_TODO_ITEM', item)
    },
    updateTodoItem (item: TodoItem, e: Event) {
      const newSubject = (e.target as HTMLInputElement).value
      if (newSubject.length > 0) {
        this.$store.dispatch('todo/UPDATE_TODO_ITEM', {
          item,
          newSubject
        })
      } else {
        // Restore the original string if input value is empty
        (e.target as HTMLInputElement).value = item.subject
      }
    }
  },
  computed: {
    requireInputTodoMessage (): string {
      return this.$store.state.message.requireInputTodo
    }
  }
})
</script>

<style lang="scss" scoped>
li {
  margin-bottom: 1rem;
  list-style-type: none;
  .todo-drag {
    margin: 0;
    padding: 0;
    border: 0;
    background-color: inherit;
    color: $color-selectable-object;
    cursor: move;
    .drag-icon {
      width: 10px;
      height: 20px;
      transform: scale(0.9);
      vertical-align: middle;
      &:first-child {
        letter-spacing: -0.4rem;
      }
      &:last-child {
        letter-spacing: 0.3rem;
      }
    }
  }
  input[type="checkbox"] {
    appearance: none;
    width: 0;
    border: 0;
    outline: 0;
    &:checked + label:before {
      border-color: $color-accent;
    }
    &:checked + label:after {
      transform: scale(1);
      opacity: 0.8;
    }
    &:focus-visible + label {
      outline: -webkit-focus-ring-color auto 1px;
    }
  }
  label {
    display: inline-block;
    position: relative;
    width: 24px;
    height: 24px;
    margin: 0 6px;
    padding: 3px;
    vertical-align: middle;
    &:before,
    &:after {
      position: absolute;
      content: "";
      transition: 0.2s ease-in-out;
    }
    &:before {
      width: 18px;
      height: 18px;
      border: solid 1px $color-editable-object;
      background-color: $color-page-light;
    }
    &:after {
      top: 6px;
      left: 6px;
      width: 12px;
      height: 12px;
      transform: scale(0.5);
      background-color: $color-accent;
      opacity: 0;
    }
  }
  input[type="text"] {
    width: 15.5rem;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid $color-editable-object;
    border-left: 0;
    border-radius: 0;
    background-color: inherit;
    font-size: 1rem;
    line-height: 1.3rem;
    vertical-align: middle;
    transition: 0.2s ease-in-out;
    &:focus {
      border-bottom: 1px solid $color-accent;
      outline: 0;
      background-color: $color-page-light;
    }
  }
  .todo-sub-info {
    margin: 0.3rem;
    text-align: right;
    span {
      font-size: small;
    }
    .todo-remove {
      margin-left: 0.3rem;
      padding: 0;
      border: 0;
      background-color: inherit;
      .remove-icon {
        color: $color-selectable-object;
      }
    }
  }
}
</style>
