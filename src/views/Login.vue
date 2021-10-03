<template>
  <div class="page-base" id="login-page">
    <section>
      <h1 class="title is-4">
        <!-- should not add new line before title string -->
        <b-icon icon="account-circle"></b-icon>ログイン
      </h1>

      <p class="info-message" id="require-message" v-if="this.$route.query.message">
        {{ this.$store.state.message.requireLogin }}
      </p>

      <form class="login-form" @submit.prevent="login">
        <b-field label="ユーザーID">
          <b-input
            id="user-id-input"
            name="id-field"
            autofocus
            placeholder="ユーザーIDを入力してください"
            v-model="userId"
            aria-label="input user id">
          </b-input>
        </b-field>

        <b-field label="パスワード">
          <b-input
            id="password-input"
            name="pw-field"
            type="password"
            password-reveal
            placeholder="パスワードを入力してください"
            v-model="password"
            aria-label="input password">
          </b-input>
        </b-field>

        <b-button
          id="login-submit"
          name="login-btn"
          native-type="submit"
          :disabled="!userId || !password"
          :loading="loading"
        >
          ログイン
        </b-button>
      </form>

      <p class="error-message has-text-danger"
        v-if="loginUserError"
        v-html="this.$store.state.message.loginError">
      </p>

      <b-message title="Info" aria-close-label="Close message">
        このログイン画面はテスト用のダミーです。以下のユーザー情報でログインできます。<br>
        ユーザーID：testID<br>
        パスワード：testPASS
      </b-message>
    </section>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'

export default {
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
  width: 80vw;
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
form {
  width: 20rem;
  max-width: 80vw;
  margin: 1rem auto;
  .field {
    text-align: left;
  }
  .button {
    margin-top: 1rem;
    border-color: #01653d;
    color: #01653d;
    transition: 0.2s ease-in-out;
    &:disabled {
      border-color: #dbdbdb;
      color: #363636;
    }
    &::-moz-focus-inner {
      border: 0;
    }
  }
}
form {
  :deep(input) {
    &:active,
    &:focus {
      border-color: #01653d;
    }
    &:focus ~ .icon > .mdi-eye,
    &:focus ~ .icon > .mdi-eye-off {
      color: cadetblue;
    }
  }
  :deep(
  .mdi-eye,
  .mdi-eye-off) {
    color: #dbdbdb;
  }
}
.error-message {
  margin: 1rem 0;
}
article.message {
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
