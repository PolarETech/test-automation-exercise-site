<template>
  <div class="about">
    <section>
      <h1 class="title is-4">このサイトについて</h1>

      <b-tabs position="is-centered">
        <b-tab-item label="テストコンテンツ">
          <div class="content">
            <h2 class="subtitle is-5">テストコンテンツの利用について</h2>
            <p>
              本サイトの "TodoList" およびTodoListにアクセスするための "Login" は、自動テストのスクリプト作成練習用のコンテンツです。<br>
              テストスクリプト作成の練習を目的とする場合に限り、商用・非商用にかかわらず自由にお使いいただけます。<br>
              個人の勉強、企業の研修、テスト自動化に関する情報共有記事の作成などにご活用ください。
            </p>

            <h2 class="subtitle is-5">利用上の注意</h2>
            <ul>
              <li>TodoListのデータはすべてブラウザ内に保存され、サーバへの送信は行われません。</li>
              <li>ログイン機能はダミーです。個人情報を保護する機能はありません。他者と共有しているブラウザでは重要なデータを保存しないでください。</li>
              <li>本サイトの公開サーバへ過度な負荷がかかるような利用はご遠慮ください。</li>
            </ul>
          </div>
        </b-tab-item>

        <b-tab-item label="動作環境">
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
        </b-tab-item>

        <b-tab-item label="著作権と免責事項">
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
        </b-tab-item>
      </b-tabs>

    </section>
  </div>
</template>

<style lang="scss">
.tabs {
  a {
    color: #080d07;
  }
  li.is-active {
    a {
      color: #01653d;
      border-bottom-color: #01653d;
    }
  }
}
</style>

<style lang="scss" scoped>
.about {
  min-height: 100vh;
  padding-right: 1rem;
  padding-left: 1rem;
  overflow: hidden;
  background-color: #f4efef;
}
section {
  border-radius: 6px;
  background-color: #f8f4f4;
}
h1, h2, p, li {
  color: #080d07;
}
h1.title.is-4 {
  margin: 0;
  padding: 0.8rem 0 0.8rem 0.5rem;
}
.content h2:not(:first-child) {
  margin-top: 2rem;
}
</style>
