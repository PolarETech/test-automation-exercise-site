<template>
  <div
    class="navbar is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link
        class="navbar-item"
        id="top-logo-link"
        to="/"
        aria-label="Go to Home page"
      >
        <svg viewBox="0 0 64 64" id="top-logo">
          <use xlink:href="#polartech-logo"></use>
        </svg>
      </router-link>

      <a
        class="navbar-burger"
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
    >
      <div class="navbar-end" @click="closeMenu()">
        <router-link class="navbar-item" id="nav-home-link" to="/">Home</router-link>
        <router-link class="navbar-item" id="nav-about-link" to="/about">About</router-link>
        <router-link class="navbar-item" id="nav-todo-link" to="/todo">TodoList</router-link>
        <router-link class="navbar-item" id="nav-login-link" v-if="!GET_LOGIN_STATUS" to="/login">Login</router-link>
        <a class="navbar-item" id="nav-logout-link" v-if="GET_LOGIN_STATUS" @click="logout">Logout</a>
      </div>
    </div>

    <div class="svg-data">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <symbol viewbox="0 0 64 64" id="polartech-logo">
            <g>
              <title>Polar Tech Logo</title>
              <line id="svg_1" fill="none" x1="8" y1="31" x2="8" y2="44" stroke-linecap="round"/>
              <line id="svg_2" fill="none" x1="16" y1="21" x2="16" y2="44" stroke-linecap="round"/>
              <line id="svg_3" fill="none" x1="24" y1="20" x2="24" y2="44" stroke-linecap="round"/>
              <line id="svg_4" fill="none" x1="32" y1="27" x2="32" y2="44" stroke-linecap="round"/>
              <line id="svg_5" fill="none" x1="40" y1="31" x2="40" y2="44" stroke-linecap="round"/>
              <line id="svg_6" fill="none" x1="48" y1="35" x2="48" y2="44" stroke-linecap="round"/>
              <line id="svg_7" fill="none" x1="56" y1="31" x2="56" y2="44" stroke-linecap="round"/>
            </g>
          </symbol>
        </defs>
      </svg>
    </div>
  </div>

  <Toast position="top-center" />
</template>

<script>
import Toast from 'primevue/toast'

export default {
  name: 'NavBar',
  components: {
    Toast
  },
  data () {
    return {
      isNavMenuOpen: false
    }
  },
  methods: {
    toggleMenuExpand () {
      this.isNavMenuOpen = !this.isNavMenuOpen
    },
    closeMenu () {
      if (this.isNavMenuOpen) {
        this.isNavMenuOpen = false
      }
    },
    async logout (dispatch) {
      this.$store.dispatch('auth/LOGOUT')
      this.$router.push('/')
      this.$toast.add({
        detail: 'ログアウトしました',
        life: 2000
      })
    }
  },
  watch: {
    $route () {
      this.closeMenu()
    }
  },
  computed: {
    GET_LOGIN_STATUS () {
      return this.$store.getters['auth/GET_LOGIN_STATUS']
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #0a0a0a;
  border-bottom: 1px solid #060606;
  opacity: 0.9;
  #top-logo {
    width: 30px;
    height: 30px;
    stroke: palegoldenrod;
    stroke-width: 4;
  }
  .navbar-burger {
    color: palegoldenrod;
  }
  .navbar-menu {
    padding-right: 0.5rem;
    text-align: right;
    .navbar-item {
      outline: 0;
      color: palegoldenrod;
      text-shadow: 1px 1px 4px #101010, -1px -1px 4px #101010;
      &:hover,
      &:focus {
        color: snow;
      }
    }
    .router-link-exact-active {
      color: khaki;
      font-weight: bold;
    }
  }
}
</style>

<style lang="scss">
.p-toast.p-toast-top-center {
  width: 12rem;
  .p-toast-message {
    border: none;
    background-color: hsl(0, 0%, 29%);
    color: hsl(0, 0%, 98%);
  }
  .p-toast-message-icon,
  .p-toast-icon-close {
    display: none;
  }
  .p-toast-message-text,
  .p-toast-detail {
    margin: 0 !important;
    text-align: center;
  }
}
</style>
