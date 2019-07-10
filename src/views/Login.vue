<template>
  <div class="login">
    <h1>ログイン</h1>
    <p id="requireMessage" v-show="this.$route.query.message">{{ this.$store.state.message.requireLogin }}</p>
    <form class="login" @submit.prevent="login">
      <label>ユーザーID: </label>
      <input required v-model="userId" type="text" placeholder="ユーザーIDを入力してください"/>
      <label>パスワード: </label>
      <input required v-model="password" type="password" placeholder="パスワードを入力してください"/>
      <hr/>
      <button type="submit" :disabled="!userId || !password">ログイン</button>
      <p class="errorMessage" v-show="loginUserError">{{ this.$store.state.message.loginError }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userId: '',
      password: ''
    }
  },
  methods: {
    async login () {
      const res = await this.$store.dispatch('auth/LOGIN', {
        userId: this.userId,
        password: this.password
      })
      if (res) {
        const path = this.$route.query.redirect || '/todo'
        this.$router.push(path)
      }
    }
  },
  computed: {
    loginUserError () {
      return this.$store.getters['auth/isLoginUserError']
    }
  }
}
</script>
