<template>
  <div class="page-base" id="home-page">
    <div id="top-image"></div>

    <section class="hero is-fullheight">
      <div class="hero-body">

        <div class="container">
          <div class="columns is-tablet is-gapless">
            <div class="column is-full-mobile is-half-tablet has-text-left">
              <h1 class="title">TEST <br>AUTOMATION <br>EXERCISE <br>SITE</h1>
            </div>

            <div class="column link-buttons">
              <router-link
                class="button"
                id="about-button"
                tag="button"
                to="/about"
                ontouchstart
              >
                このサイトについて - About
              </router-link>

              <router-link
                class="button"
                id="todo-button"
                tag="button"
                to="/todo"
                ontouchstart
              >
                テストコンテンツ - TodoList
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
export default {
  head: {
    title: {
      inner: 'Home'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-base {
  min-height: 100vh;
  overflow: hidden;
}
#home-page {
  background-color: #141414;
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
        color: ghostwhite;
        letter-spacing: 0.2rem;
        text-shadow: 1px 1px 4px rgba(10, 10, 10, 0.7), -1px -1px 3px rgba(10, 10, 10, 0.7);
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
          background-color: rgba(#01653d, 0.8);
          box-shadow: -1px 2px 8px 2px rgba(0, 0, 0, 0.3);
          color: #fbf6a3;
          font-weight: 600;
          opacity: 0.7;
          &:hover,
          &:active {
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
