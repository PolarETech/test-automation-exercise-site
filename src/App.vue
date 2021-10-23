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

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'

export default defineComponent({
  components: {
    navbar: NavBar
  }
})
</script>

<style lang="scss">
#app {
  font-family: $font-set;
}
header + div {
  margin-top: -3.25rem;
  padding-top: 4rem;
  padding-bottom: 3rem;
}
footer {
  margin: calc(-2rem - 1px) auto 0;
  border-top: 1px solid $color-black-dark;
  font-size: 0.8rem;
  line-height: 1rem;
  opacity: 0.9;
}
</style>
