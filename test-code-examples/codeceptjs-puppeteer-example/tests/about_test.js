Feature('About view test.js @about @desktop')

Before(({ I }) => {
  I.amOnPage('/about')
})

Scenario('displays "About" page', ({ I }) => {
  I.seeTitleEquals('About | test automation exercise site')
  I.seeElement({ css: 'header .navbar' })
  I.see('このサイトについて', { css: 'h1' })
  I.see('テストコンテンツ', { css: 'ul.p-tabview-nav li' })
  I.see('動作環境', { css: 'ul.p-tabview-nav li' })
  I.see('著作権と免責事項', { css: 'ul.p-tabview-nav li' })
  I.see('技術情報', { css: 'ul.p-tabview-nav li' })
  I.see('© 2019 Polar Tech', { css: 'footer' })
}).tag('@smoke')

Scenario('displays "Test Contents" tab', ({ I }) => {
  I.click('テストコンテンツ', { css: 'ul.p-tabview-nav' })
  I.seeElement({ css: 'div.p-tabview-panel:nth-of-type(1)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(2)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(3)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(4)' })
  I.see('テストコンテンツの利用について', { css: 'h2' })
  I.see('利用上の注意', { css: 'h2' })
  I.see('TodoList 機能概要', { css: 'h2' })
})

Scenario('displays "Environment" tab', ({ I }) => {
  I.click('動作環境', { css: 'ul.p-tabview-nav' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(1)' })
  I.seeElement({ css: 'div.p-tabview-panel:nth-of-type(2)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(3)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(4)' })
  I.see('動作環境', { css: 'h2' })
})

Scenario('displays "Copyright and Disclaimer" tab', ({ I }) => {
  I.click('著作権と免責事項', { css: 'ul.p-tabview-nav' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(1)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(2)' })
  I.seeElement({ css: 'div.p-tabview-panel:nth-of-type(3)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(4)' })
  I.see('著作権', { css: 'h2' })
  I.see('免責事項', { css: 'h2' })
})

Scenario('displays "Technical Information" tab', ({ I }) => {
  I.click('技術情報', { css: 'ul.p-tabview-nav' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(1)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(2)' })
  I.dontSeeElement({ css: 'div.p-tabview-panel:nth-of-type(3)' })
  I.seeElement({ css: 'div.p-tabview-panel:nth-of-type(4)' })
  I.see('ソースコードの公開について', { css: 'h2' })
  I.see('本サイトの作成で使用している主な技術要素', { css: 'h2' })
})
