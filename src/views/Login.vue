<template>
  <div class="page-base" id="login-page">
    <section>
      <h1 class="title is-4">
        <!-- should not add new line before title string -->
        <span class="icon pi pi-user"></span>ログイン
      </h1>

      <p class="info-message" id="require-message" v-if="this.$route.query.message">
        {{ this.$store.state.message.requireLogin }}
      </p>

      <form class="login-form" @submit.prevent="login">
        <div class="p-field">
          <label for="user-id-input">ユーザーID</label>
          <InputText
            type="text"
            id="user-id-input"
            name="id-field"
            autofocus
            placeholder="ユーザーIDを入力してください"
            v-model="userId"
            aria-label="input user id"
          />
        </div>

        <div class="p-field">
          <label for="password-input">パスワード</label>
          <Password
            id="password-input"
            name="pw-field"
            placeholder="パスワードを入力してください"
            :feedback="false"
            toggleMask
            v-model="password"
            aria-label="input password"
          />
        </div>

        <Button
          class="p-button-outlined"
          id="login-submit"
          name="login-btn"
          type="submit"
          :disabled="!userId || !password"
          :loading="loading"
          label="ログイン"
        />
      </form>

      <p class="error-message has-text-danger"
        v-if="loginUserError"
        v-html="this.$store.state.message.loginError">
      </p>

      <Panel header="Info">
        <p>このログイン画面はテスト用のダミーです。以下のユーザー情報でログインできます。<br>
        ユーザーID : testID<br>
        パスワード : testPASS</p>
      </Panel>
    </section>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'
import InputText from 'primevue/inputtext'
import Password from '@/components/Password.vue'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import { configureCompat } from 'vue'

configureCompat({
  COMPONENT_V_MODEL: false
})

export default {
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
      loading: false
    }
  },
  setup () {
    useHead({
      title: 'Login | test automation exercise site'
    })
  },
  methods: {
    async login () {
      this.loading = true
      const res = await this.$store.dispatch('auth/LOGIN', {
        userId: this.userId,
        password: this.password
      })
      if (res) {
        const path = this.$route.query.redirect || '/todo'
        this.$router.push(path)
      }
      this.loading = false
    }
  },
  computed: {
    loginUserError () {
      return this.$store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']
    }
  }
}
</script>

<style lang="scss" scoped>
.page-base {
  min-height: 100vh;
  overflow: hidden;
}
#login-page {
  padding-right: 1rem;
  padding-left: 1rem;
  background-color: #f4efef;
}
section {
  margin: 0 auto;
  text-align: center;
}
:deep(.p-component) {
  font-family: 'Avenir', 'Yu Gothic Medium', 'YuGothic', Helvetica, Arial, verdana, sans-serif;
}
h1.title.is-4 {
  margin: 0 auto;
  padding: 0.8rem 0;
  color: #01653d;
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
    }
  }
  .p-button.p-button-outlined {
    margin-top: 2rem;
    border-color: #01653d;
    background: #ffffff;
    color: #01653d;
    transition: 0.2s ease-in-out;
    &:enabled:active,
    &:enabled:hover {
      background: #ffffff;
    }
    &:disabled {
      border-color: #dbdbdb;
      background: #ffffff;
      color: #363636;
    }
    &::-moz-focus-inner {
      border: 0;
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
