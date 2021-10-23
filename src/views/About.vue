<template>
  <div class="page-base" id="about-page">
    <section role="main">
      <h1 class="title is-4">このサイトについて</h1>

      <TabView scrollable @tab-change="unfocus()" @tab-click="unfocus()">
        <TabPanel header="テストコンテンツ">
          <div class="content">
            <h2 class="subtitle is-5">テストコンテンツの利用について</h2>
            <p>
              本サイトの "TodoList" および "Login" は、自動テストのスクリプト作成練習用のコンテンツです。<br>
              テストスクリプト作成の練習を目的とする場合に限り、商用・非商用にかかわらず自由にお使いいただけます。<br>
              個人の勉強、企業の研修、テスト自動化に関する情報共有記事の作成などにご活用ください。
            </p>

            <h2 class="subtitle is-5">利用上の注意</h2>
            <ul>
              <li>TodoListのデータはすべてブラウザ内に保存され、サーバへの送信は行われません。</li>
              <li>ログイン機能はダミーです。個人情報を保護する機能はありません。他者と共有しているブラウザでは重要なデータを保存しないでください。</li>
              <li>本サイトの公開サーバへ過度な負荷がかかるような利用はご遠慮ください。</li>
            </ul>

            <h2 class="subtitle is-5">TodoList 機能概要</h2>
            <ul>
              <li>TodoListへアクセスするにはログインが必要です。</li>
              <li>ログイン画面ではユーザーIDとパスワードの入力が必要です。（ユーザーID：testID、パスワード：testPASS）</li>
              <li>ログインに失敗すると、ログイン画面上にエラーメッセージが表示されます。</li>
              <li>ログインに成功すると、TodoList画面へ移動します。</li>
              <li>登録フォームにToDoの件名を入力して＋アイコンを選択するかEnterキーを押すと、新しいToDoを登録できます。</li>
              <li>ToDoの件名の最大登録可能文字数は15文字です。登録文字種の制限はありません。</li>
              <li>最大5件までToDoを登録できます。5件登録されている状態では登録フォームが非表示になります。</li>
              <li>1件のToDoには、件名、処理済／未済のチェック、処理済／未済の最終確認日時の情報が含まれます。</li>
              <li>ToDoの件名は登録後に修正できます。</li>
              <li>各ToDoの左端にあるドラッグアイコンをドラッグすると、ToDoの順番を変更できます。</li>
              <li>各ToDoの右下にあるゴミ箱アイコンを選択すると、そのToDoを削除できます。</li>
              <li>メニューバーのLogoutをクリックすると、ログアウトしてHome画面へ移動します。</li>
            </ul>
          </div>
        </TabPanel>

        <TabPanel header="動作環境">
          <div class="content">
            <h2 class="subtitle is-5">動作環境</h2>
            <p>
              以下の環境で動作確認を行っています。
            </p>
            <ul>
              <li>Windows: Chrome, Firefox, Edge</li>
              <li>Mac: Safari, Chrome, Firefox</li>
              <li>Mobile: Chrome Mobile Emulation, iOS Safari</li>
            </ul>
            <p>
              ブラウザのバージョンはページ公開時点の最新版です。<br>
              環境によって表示や動作が一部異なる場合があります。<br>
              ブラウザのJavaScript設定を無効にしている場合は正しく機能しません。
            </p>
          </div>
        </TabPanel>

        <TabPanel header="著作権と免責事項">
          <div class="content">
            <h2 class="subtitle is-5">著作権</h2>
            <p>
              本サイトの著作権はPolar Techが保有しています。<br>
              "テストコンテンツの利用について" に記した範囲を除き、本サイトのすべてまたは一部を、法律にて定められる私的使用等の範囲を超えて、無断で複製、転用、改変、公衆送信、販売などの行為を行うことはできません。
            </p>

            <h2 class="subtitle is-5">免責事項</h2>
            <p>
              予告なしに本サイトの公開を中断または中止、内容を修正、変更、削除する場合があります。<br>
              本サイトを利用することによって生じたいかなる損害についても、一切の責任を負いません。
            </p>
          </div>
        </TabPanel>

        <TabPanel header="技術情報">
          <div class="content">
            <h2 class="subtitle is-5">ソースコードの公開について</h2>
            <p>
              本サイトのソースコードをGitHubで公開しています。
            </p>
            <p>
              GitHub URL：<br>
              <a href="https://github.com/PolarETech/test-automation-exercise-site">https://github.com/PolarETech/test-automation-exercise-site</a>
            </p>
            <p>
              サイトソース：<br>
              <a href="https://github.com/PolarETech/test-automation-exercise-site/tree/main/src">https://github.com/PolarETech/test-automation-exercise-site/tree/main/src</a>
            </p>
            <p>
              テストコード：<br>
            </p>
            <ul>
              <li><a href="https://github.com/PolarETech/test-automation-exercise-site/tree/main/tests/unit">Jest</a></li>
              <li><a href="https://github.com/PolarETech/test-automation-exercise-site/tree/main/tests/e2e">Cypress</a></li>
              <li><a href="https://github.com/PolarETech/test-automation-exercise-site/tree/main/test-code-examples/codeceptjs-puppeteer-example">CodeceptJS and Puppeteer</a></li>
              <li><a href="https://github.com/PolarETech/test-automation-exercise-site/tree/main/test-code-examples/cucumberjs-selenium-example">Cucumber.js and Selenium</a></li>
            </ul>

            <h2 class="subtitle is-5">本サイトの作成で使用している主な技術要素</h2>
            <ul>
              <li>Vue.js</li>
              <li>Vuex</li>
              <li>Vite</li>
              <!-- <li>Vue CLI 3</li> -->
              <li>PrimeVue</li>
              <li>Bulma</li>
              <!-- <li>Buefy</li> -->
              <li>Jest</li>
              <li>Cypress</li>
              <li>HTML5</li>
              <li>CSS3/SCSS</li>
              <li>SVG</li>
              <li>TypeScript</li>
              <li>JavaScript</li>
              <li>Node.js</li>
              <li>npm</li>
              <li>Git</li>
              <li>GitHub Pages</li>
              <li>Google Analytics</li>
              <li>Single Page Application (SPA)</li>
              <li>Responsive Web Design (RWD)</li>
            </ul>
          </div>
        </TabPanel>
      </TabView>

    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

export default defineComponent({
  components: {
    TabView,
    TabPanel
  },
  setup () {
    useHead({
      title: 'About | test automation exercise site'
    })
  },
  methods: {
    unfocus () {
      (document.activeElement as HTMLAnchorElement).blur()
    }
  }
})
</script>

<style lang="scss" scoped>
.page-base {
  min-height: 100vh;
  overflow: hidden;
}
#about-page {
  padding-right: 1rem;
  padding-left: 1rem;
  background-color: $color-page-back;
}
section {
  border-radius: 6px;
  background-color: $color-text-back;
}
:deep(.p-component) {
  font-family: $font-set;
}
h1.title.is-4 {
  margin: 0;
  padding: 0.8rem 0 0.8rem 0.5rem;
}
.content h2:not(:first-child) {
  margin-top: 2rem;
}
:deep(.p-tabview-nav) {
  li.p-highlight a.p-tabview-nav-link:not(.p-disabled) {
    border-bottom-color: $color-accent;
    .p-tabview-title {
      color: $color-accent;
    }
  }
}
:deep(.p-tabview-nav-next) {
  @media screen and (min-width: $navbar-breakpoint) {
    display: none;
  }
}
</style>
