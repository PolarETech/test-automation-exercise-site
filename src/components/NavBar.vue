<template>
  <div
    class="navbar is-fixed-top is-dark"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img
          id="top-logo"
          src="@/assets/polartech-logo.svg"
          width="30"
          height="30"
          alt="Polar Tech"
        />
      </a>

      <a
        class="navbar-burger"
        id="nav-burger"
        role="button"
        aria-label="menu"
        aria-expanded="false"
        data-target="nav-menu"
        @click="toggleMenuExpand()"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      class="navbar-menu"
      :class="{ 'is-active': isNavMenuOpen }"
      id="nav-menu"
    >
      <div class="navbar-end" @click="toggleMenuExpand()">
        <router-link class="navbar-item" id="home" to="/">Home</router-link>
        <router-link class="navbar-item" id="todo" to="/todo">TodoList</router-link>
        <router-link class="navbar-item" id="about" to="/about">About</router-link>
        <router-link class="navbar-item" id="login" v-if="!isLogin" to="/login">Login</router-link>
        <a class="navbar-item" id="logout" v-if="isLogin" @click="logout">Logout</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      isNavMenuOpen: false
    }
  },
  methods: {
    toggleMenuExpand () {
      this.isNavMenuOpen = !this.isNavMenuOpen
    },
    async logout (dispatch) {
      this.$store.dispatch('auth/LOGOUT')
      this.$router.push('/')
      this.$toast.open({
        message: 'ログアウトしました',
        position: 'is-top',
        type: 'is-dark'
      })
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters['auth/isLogin']
    }
  }
}
</script>
