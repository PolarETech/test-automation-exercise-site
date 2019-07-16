<template>
  <div id="app">
    <header>
      <navbar/>
    </header>

    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/todo">Todo</router-link>
    </div>
    <router-view/>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>© 2019 Polar Tech</p>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    navbar: NavBar
  },
  data () {
    return {
      isNavMenuOpen: false
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
footer {
  margin: calc(-2rem - 1px) auto 0;
  border-top: 1px solid #060606;
  color: palegoldenrod;
  font-size: 0.8rem;
  line-height: 1rem;
  opacity: 0.9;
}
</style>
