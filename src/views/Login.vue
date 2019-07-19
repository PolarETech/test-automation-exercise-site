<template>
  <div class="login">
    <section>
      <h1 class="title is-4">
        <b-icon icon="account-circle"></b-icon>
        ログイン
      </h1>

      <p id="requireMessage" v-if="this.$route.query.message">
        {{ this.$store.state.message.requireLogin }}
      </p>

      <form class="login-form" @submit.prevent="login">
        <b-field label="ユーザーID">
          <b-input
            v-model="userId"
            placeholder="ユーザーIDを入力してください"
            autofocus>
          </b-input>
        </b-field>

        <b-field label="パスワード">
          <b-input
            v-model="password"
            type="password"
            placeholder="パスワードを入力してください"
            password-reveal>
          </b-input>
        </b-field>

        <b-button native-type="submit" :loading="loading" :disabled="!userId || !password">ログイン</b-button>
      </form>

      <p class="errorMessage has-text-danger"
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
export default {
  data () {
    return {
      userId: '',
      password: '',
      loading: false
    }
  },
  head: {
    title: {
      inner: 'Login'
    }
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

<style lang="scss">
.input {
  &:active,
  &:focus {
    border-color: #01653d;
  }
}
.mdi-eye,
.mdi-eye-off {
  color: #dbdbdb;
}
.input:focus + .icon > .mdi-eye,
.input:focus + .icon > .mdi-eye-off {
  color: cadetblue;
}
</style>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  padding-right: 1rem;
  padding-left: 1rem;
  overflow: hidden;
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
  }
}
.errorMessage {
  margin: 1rem 0;
}
article.message {
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
