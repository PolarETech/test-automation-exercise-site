<template>
  <header>
    <navbar/>
  </header>

  <router-view/>

  <footer class="footer">
    <div class="content has-text-centered">
      <p>© 2019 Polar Tech</p>
    </div>
  </footer>
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
  font-family: 'Avenir', 'Yu Gothic Medium', 'YuGothic', Helvetica, Arial, verdana, sans-serif;
}
header + div {
  margin-top: -3.25rem;
  padding-top: 4rem;
  padding-bottom: 3rem;
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
