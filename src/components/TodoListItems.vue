<template>
  <li :class="{ is_done: item.isDone }" :id="item.id">
    <b-icon class="drag-icon"
      :id="'dg-' + item.id"
      icon="drag-vertical"
      size="is-small">
    </b-icon>

    <input
      class="todo-check"
      :id="'cb-' + item.id"
      type="checkbox"
      :checked="item.isDone"
      @click="DONE_TODO_ITEM(item)"
    />
    <label :for="'cb-' + item.id"></label>

    <input
      class="todo-subject"
      :id="'sj-' + item.id"
      type="text"
      maxlength="15"
      :placeholder="this.$store.state.message.requireImputTodo"
      :value="item.subject"
      @change="updateTodoItem(item, $event)"
    />

    <div class="todo-sub-info">
      <span class="todo-timestamp" :id="'ts-' + item.id">確認日時：{{ item.timestamp }}</span>

      <button class="todo-remove" :id="'rm-' + item.id" @click="REMOVE_TODO_ITEM(item)">
        <b-icon id="remove-icon" icon="delete" size="is-small"></b-icon>
      </button>
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
  .icon {
    color: gray;
  }
  .drag-icon {
    width: 16px;
    height: 18px;
    transform: scale(1.3);
    vertical-align: middle;
    cursor: move;
  }
  input[type=checkbox] {
    appearance: none;
    width: 0;
    border: 0;
    outline: 0;
  }
  label {
    display: inline-block;
    position: relative;
    width: 18px;
    height: 18px;
    margin: 0 9px;
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
      border: solid 1px darkgray;
      background-color: #f8f4f4;
    }
    &:after {
      top: 3px;
      left: 3px;
      width: 12px;
      height: 12px;
      transform: scale(0.5);
      background-color: #01653d;
      opacity: 0;
    }
  }
  input[type="checkbox"] {
    &:checked + label:before {
      border-color: #01653d;
    }
    &:checked + label:after {
      transform: scale(1);
      opacity: 0.8;
    }
  }
  input[type="text"] {
    width: 15.5rem;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid darkgray;
    border-left: 0;
    border-radius: 0;
    background-color: inherit;
    font-size: 1rem;
    line-height: 1.3rem;
    vertical-align: middle;
    transition: 0.2s ease-in-out;
    &:focus {
      border-bottom: 1px solid #01653d;
      outline: 0;
      background-color: #f8f4f4;
    }
  }
  .todo-sub-info {
    margin-right: 0.3rem;
    text-align: right;
    span {
      font-size: small;
    }
    .todo-remove {
      margin: 0.5rem;
      padding: 0rem;
      transform: scale(1.3);
      border: 0;
      background-color: inherit;
      cursor: default;
    }
  }
}
</style>
