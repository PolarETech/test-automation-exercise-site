<template>
  <div class="page-base" id="home-page">
    <div id="top-image"></div>

    <section class="hero is-fullheight" role="main">
      <div class="hero-body">

        <div class="container">
          <div class="columns is-tablet is-gapless">
            <div class="column is-full-mobile is-half-tablet has-text-left">
              <h1 class="title">TEST <br>AUTOMATION <br>EXERCISE <br>SITE</h1>
            </div>

            <div class="column link-buttons">
              <router-link to="/about" custom v-slot="{ navigate }">
                <button @click="navigate" class="button" id="about-button" role="link" ontouchstart>
                  このサイトについて - About
                </button>
              </router-link>

              <router-link to="/todo" custom v-slot="{ navigate }">
                <button @click="navigate" class="button" id="todo-button" role="link" ontouchstart>
                  テストコンテンツ - TodoList
                </button>
              </router-link>
            </div>
          </div>
          <!-- .columns end  -->
        </div>
        <!-- .container end -->

      </div>
    </section>

  </div>
</template>

<script>
import { useHead } from '@vueuse/head'

// import { configureCompat } from 'vue'
// configureCompat({
//   RENDER_FUNCTION: false
// })

export default {
  setup () {
    useHead({
      title: 'Home | test automation exercise site'
    })
  }
}
</script>

<style lang="scss" scoped>
.page-base {
  min-height: 100vh;
  overflow: hidden;
}
#home-page {
  background-color: $color-home-back;
}
#top-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 80vw;
  height: 76vh;
  background-image: url("../assets/bark-branch-daylight.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(3px);
}
.hero {
  min-height: 80vh;
  .hero-body {
    padding: 0 0 0 7vw;
    .container {
      max-width: initial;
      height: 60vh;
      .title {
        color: $color-home-title;
        letter-spacing: 0.2rem;
        text-shadow: 1px 1px 4px rgba($color-black, 0.7), -1px -1px 3px rgba($color-black, 0.7);
        opacity: 0.7;
      }
      .link-buttons {
        position: absolute;
        right: 0;
        bottom: 0;
        .button {
          display: block;
          width: 25vw;
          min-width: 16rem;
          height: 3rem;
          margin-top: 1rem;
          border: 0;
          border-top-right-radius: 0;
          border-top-left-radius: 290486px;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 290486px;
          background-color: rgba($color-accent, 0.8);
          box-shadow: -1px 2px 8px 2px rgba($color-black, 0.3);
          color: $color-gold-middle;
          font-weight: 600;
          opacity: 0.7;
          &:hover,
          &:active,
          &:focus {
            animation: emphasis 0.4s ease-out forwards;
          }
          @keyframes emphasis {
            0% { opacity: 0.7; transform: scale(1.0); }
            80% { opacity: 0.8; transform: scale(1.066); }
            100% { opacity: 0.8; transform: scale(1.060); }
          }
        }
      }
    }
  }
}
</style>
