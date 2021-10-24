<template>
  <div class="page-base" id="login-page">
    <section role="main">
      <h1 class="title is-4">
        <!-- should not add new line before title string -->
        <span class="icon pi pi-user"></span>ログイン
      </h1>

      <p class="info-message" id="require-message" v-if="isLoginRequired">
        {{ requireLoginMessage }}
      </p>

      <form class="login-form" @submit.prevent="doLogin()">
        <div class="p-field">
          <label for="user-id-input">ユーザーID</label>
          <InputText
            id="user-id-input"
            ref="userIdInputElement"
            name="id-field"
            type="text"
            required
            autofocus
            placeholder="ユーザーIDを入力してください"
            v-model="userId"
          />
        </div>

        <div class="p-field">
          <label for="password-input">パスワード</label>
          <Password
            id="password-input"
            name="pw-field"
            required
            placeholder="パスワードを入力してください"
            :feedback="false"
            toggleMask
            v-model="password"
          />
        </div>

        <Button
          class="p-button-outlined"
          id="login-submit"
          ref="loginButtonElement"
          name="login-btn"
          type="submit"
          :disabled="isLoginButtonDisabled"
          :loading="isLoginProcessing"
          label="ログイン"
        />
      </form>

      <p class="error-message has-text-danger"
        v-if="isLoginUserError"
        v-html="loginErrorMessage">
      </p>

      <Panel header="Info">
        <p>このログイン画面はテスト用のダミーです。以下のユーザー情報でログインできます。<br>
        ユーザーID : testID<br>
        パスワード : testPASS</p>
      </Panel>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ComponentPublicInstance, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/compositions/useAuthStore'
import { useMessageStore } from '@/compositions/useMessageStore'
import { useHead } from '@vueuse/head'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Panel from 'primevue/panel'

export default defineComponent({
  components: {
    InputText,
    Password,
    Button,
    Panel
  },
  setup () {
    const router = useRouter()
    const route = useRoute()

    const {
      userId,
      password,
      isLoginProcessing,
      isLoginUserError,
      login,
      resetLoginUserErrorStatus
    } = useAuthStore()

    const { requireLoginMessage, loginErrorMessage } = useMessageStore()

    const userIdInputElement = ref<ComponentPublicInstance>()
    const loginButtonElement = ref<ComponentPublicInstance>()

    const isLoginRequired = computed(() => route.query.message === 'true')
    const isLoginButtonDisabled = computed(() => !userId.value || !password.value)

    const doLogin = async () => {
      focusSubmitButton()

      if (await login()) {
        const path = route.query.redirect || '/todo'
        router.push(String(path))
      }

      unfocusSubmitButton()
    }

    /* istanbul ignore next */
    const focusSubmitButton = () => {
      (loginButtonElement?.value?.$el as HTMLButtonElement)?.focus()
    }

    /* istanbul ignore next */
    const unfocusSubmitButton = () => {
      (loginButtonElement?.value?.$el as HTMLButtonElement)?.blur()
    }

    /* istanbul ignore next */
    const focusUserIdImput = () => {
      (userIdInputElement?.value?.$el as HTMLInputElement)?.focus()
    }

    useHead({
      title: 'Login | test automation exercise site'
    })

    onMounted(() => {
      nextTick(() => {
        // focus control
        focusUserIdImput()
      })
    })

    onUnmounted(() => {
      resetLoginUserErrorStatus()
    })

    return {
      userId,
      password,
      isLoginProcessing,
      isLoginRequired,
      isLoginButtonDisabled,
      isLoginUserError,
      requireLoginMessage,
      loginErrorMessage,
      doLogin,
      userIdInputElement,
      loginButtonElement
    }
  }
})
</script>

<style lang="scss" scoped>
.page-base {
  min-height: 100vh;
  overflow: hidden;
}
#login-page {
  padding-right: 1rem;
  padding-left: 1rem;
  background-color: $color-page-back;
}
section {
  margin: 0 auto;
  text-align: center;
}
:deep(.p-component) {
  font-family: $font-set;
}
h1.title.is-4 {
  margin: 0 auto;
  padding: 0.8rem 0;
  color: $color-accent;
  .icon {
    margin-right: 0.3rem;
  }
}
form {
  width: 20rem;
  max-width: 80vw;
  margin: 1rem auto;
  .p-field {
    margin-top: 1rem;
    text-align: left;
    * {
      display: block;
    }
    label {
      margin-bottom: 0.5rem;
      font-weight: 700;
      line-height: 1.5rem;
    }
    :deep(input) {
      width: 100%;
      background: $color-text-back;
      & + i.pi {
        color: $color-editable-object;
      }
      &:focus + i.pi {
        color: $color-selectable-object;
      }
    }
  }
  .p-button.p-button-outlined {
    margin-top: 2rem;
    border-color: $color-accent;
    background: $color-text-back;
    color: $color-accent;
    transition: 0.2s ease-in-out;
    &:enabled:active,
    &:enabled:hover {
      background: $color-text-back;
    }
    &:disabled {
      border-color: $color-disabled-object;
      background: $color-text-back;
      color: $color-disabled-text;
    }
    &::-moz-focus-inner {
      border: 0;
    }
    &.p-disabled.p-button-loading {
      opacity: 1;
    }
  }
}
.error-message {
  margin: 1rem 0;
}
:deep(.p-panel) {
  max-width: 46rem;
  margin: 3rem auto 1rem;
  box-shadow: 0 1px 3px 1px hsla(0, 0%, 71%, 0.1);
  .p-panel-header {
    background-color: hsl(0, 0%, 29%);
  }
  .p-panel-title {
    color: hsl(0, 0%, 98%);
  }
}
</style>
