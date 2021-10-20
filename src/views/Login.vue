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

      <form class="login-form" @submit.prevent="login(userId, password)">
        <div class="p-field">
          <label for="user-id-input">ユーザーID</label>
          <InputText
            id="user-id-input"
            ref="userIdInput"
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
          ref="loginSubmit"
          name="login-btn"
          type="submit"
          :disabled="isLoginButtonDisabled"
          :loading="isLoading"
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
import { ComponentPublicInstance, defineComponent } from 'vue'
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
  data () {
    return {
      userId: '',
      password: '',
      isLoading: false
    }
  },
  setup () {
    useHead({
      title: 'Login | test automation exercise site'
    })
  },
  methods: {
    async login (userId: string, password: string) {
      ((this.$refs.loginSubmit as ComponentPublicInstance).$el as HTMLButtonElement).focus()
      this.isLoading = true
      const res = await this.$store.dispatch('auth/LOGIN', {
        userId,
        password
      })
      if (res) {
        const path = this.$route.query.redirect || '/todo'
        this.$router.push(String(path))
      }
      this.isLoading = false;
      ((this.$refs.loginSubmit as ComponentPublicInstance).$el as HTMLButtonElement).blur()
    }
  },
  computed: {
    isLoginRequired (): boolean {
      return this.$route.query.message === 'true'
    },
    isLoginButtonDisabled (): boolean {
      return !this.userId || !this.password
    },
    isLoginUserError (): boolean {
      return this.$store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']
    },
    requireLoginMessage (): string {
      return this.$store.state.message.requireLogin
    },
    loginErrorMessage (): string {
      return this.$store.state.message.loginError
    }
  },
  mounted () {
    this.$nextTick(function () {
      // focus control
      ((this.$refs.userIdInput as ComponentPublicInstance).$el as HTMLInputElement).focus()
    })
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
