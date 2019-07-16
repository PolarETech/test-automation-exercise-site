<template>
  <div
    class="navbar is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <svg viewBox="0 0 64 64" id="top-logo">
          <use xlink:href="#polartech-logo"></use>
        </svg>
      </a>

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
      <div class="navbar-end" @click="toggleMenuExpand()">
        <router-link class="navbar-item" id="home" to="/">Home</router-link>
        <router-link class="navbar-item" id="todo" to="/todo">TodoList</router-link>
        <router-link class="navbar-item" id="about" to="/about">About</router-link>
        <router-link class="navbar-item" id="login" v-if="!isLogin" to="/login">Login</router-link>
        <a class="navbar-item" id="logout" v-if="isLogin" @click="logout">Logout</a>
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
    &:hover {
      color: palegoldenrod;
    }
  }
  .navbar-menu {
    padding-right: 0.5rem;
    text-align: right;
    .navbar-item {
      color: palegoldenrod;
      text-shadow: 1px 1px 4px #101010, -1px -1px 4px #101010;
      &:hover {
        color: snow;
      }
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