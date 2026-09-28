# Mint UI

学術ノートの「暗い背景・ミント色・丸い形・やわらかな動き」を、別のプロジェクトでも使うための小さな UI ライブラリです。**フレームワーク不要 / 公開 npm への登録なし**。現在の版は [package.json](package.json) の `version` が正本です。

| ファイル | 役割 |
| --- | --- |
| `theme.css` | 色、フォント、角丸、影、動きの共通変数 |
| `components.css` | ヘッダー、カード、ボタン、メニュー、タブ、表、開閉パネル |
| `mint-ui.js` | メニューの選択・キーボード操作、タブの背景移動、パネルの開閉 |
| `examples/index.html` | 学術ノートの内容に依存しない部品サンプル |

## ライブラリとアプリを別々に更新する

各アプリは好きな固定版と部品を使い、行間・余白・字体・幅・配色・情報密度を独自に調整できます。アプリで育った改善をライブラリへ取り込む作業と、新版をアプリへ採用する作業は独立しています。全アプリの一括更新・一括検証は行いません。

共通ソースを変更した後、リポジトリルートでライブラリだけをリリースします。

```powershell
node scripts/mint-ui-pipeline.mjs release
```

共通部品のテストと部品サンプルのPC・スマホ検証が通った版を `packages/mint-ui/releases/mint-ui/<version>/` に保存します。既に同じ版があり内容が異なる場合はパッチ版を上げます。各アプリの利用版やファイルは変更しません。

アプリで新版を試したい時だけ、対象と版を指定します。旧版への切り戻しも同じコマンドです。

```powershell
node scripts/mint-ui-pipeline.mjs adopt study 0.5.0
node scripts/mint-ui-pipeline.mjs check study
```

`adopt` は対象アプリだけの一時コピーで検証し、成功時にそのアプリの参照だけを切り替えます。失敗時は元の参照を保ちます。独自CSS・設定はそのままです。見た目が合わなければ、アプリ側で必要な部分を調整して再検証するか、旧版に戻せます。commit前にそのアプリの画像を確認します。

通常は `check library`（省略時もlibrary）または `check <app-id>` で対象だけを確認します。commit・push・サイト公開はパイプライン自体では実行しません。

- 個別導入・検証の一覧：[mint-ui.consumers.json](../../mint-ui.consumers.json)。強制的な全利用先台帳ではありません。
- 現在の利用先：学術ノート（study-tool）、M&Aテンプレートツール、思索日記（notes-of-thought）
- 思索日記はAstro/Fuwariの構成を保ち、共通テーマ・本文スタイル・選択メニュー・開閉操作を利用します。検証時にAstroとPagefindをビルドするため、先に `pnpm --dir notes-of-thought install --frozen-lockfile` を実行します。
- ローカルゲート：`node scripts/mint-ui-pipeline.mjs hooks` で有効化。変更したライブラリ・アプリだけを検証し、他アプリの利用版との一致は要求しません。
- GitHub CI：PRとmainへのpushで変更範囲だけを検証します。ライブラリのみの変更では各アプリの依存も導入しません。

## 別プロジェクトから読み込む

新しい利用先には、まず静的インストーラーで配布物を配置します。

```powershell
node packages/mint-ui/install.mjs "C:/path/to/project/public/vendor" "packages/mint-ui/releases/mint-ui/0.5.0"
```

インストーラーが出力する版のパスをHTMLに指定します。以下の `<version>` はその版に置き換えます。

```html
<link rel="stylesheet" href="./vendor/mint-ui/<version>/theme.css">
<link rel="stylesheet" href="./vendor/mint-ui/<version>/components.css">
<body class="mint-app">
  <!-- サンプルと同じ意味構造・属性で部品を配置 -->
  <script type="module">
    import { initMintUI } from './vendor/mint-ui/<version>/mint-ui.js';
    initMintUI();
  </script>
</body>
```

導入後はそのアプリの表示・操作を検証します。このリポジトリの個別導入コマンドを使いたい場合は、`mint-ui.consumers.json` とブラウザ検証にそのアプリを追加できます。登録は他アプリとの同時更新・同時検証を意味しません。未登録アプリは禁止せず、そのプロジェクト固有の検証手順で管理できます。

`runtimeDirectories` には、利用アプリのルートからの相対パスでローカル保存データや生成物を指定できます。例：M&Aツールの `data`、思索日記の非公開 `private`・生成先 `dist`・キャッシュ `.astro`。この領域は候補版のコピーと検証ハッシュから除外します。学術ノートの `dist` はソースなので除外せず、教材JSONも検証・リリースの対象です。

[部品サンプル](examples/index.html) と同じHTML構造を使ってください。利用先の `/vendor/mint-ui/<version>/examples/index.html` でも確認できます。ES Modulesのため `file://` ではなくローカルサーバーから開きます。フォントの読み込みは利用アプリ側で行います。

ビルドツールを使うプロジェクトでは、npm のローカルパッケージとしても利用できます。

```powershell
npm install "C:/Users/yushi/Desktop/physical-ai-ma-praxis/packages/mint-ui"
```

```js
import '@yushi/mint-ui/theme.css';
import '@yushi/mint-ui/components.css';
import { initMintUI } from '@yushi/mint-ui';

// HTML を描画したあとに初期化する。
initMintUI();
```

React などではマウント後に初期化し、アンマウント時に対応するコントローラーを破棄します。ライブラリ自身はフレームワークを追加しません。

## 部品と操作

| 部品 | CSS / 初期化用属性 |
| --- | --- |
| ページの基本 | `.mint-app` |
| ヘッダー | `.mint-header` / `.mint-header-inner` / `.mint-brand` |
| カード | `.mint-card` / `.mint-card-heading` |
| ボタン | `.mint-button` / `data-variant="primary"` または `"soft"` |
| 選択メニュー | `.mint-select[data-mint-select]` |
| タブ | `.mint-tabs[data-mint-tabs]` |
| 開閉パネル | `details.mint-disclosure[data-mint-disclosure]` |
| 表 | `.mint-table-wrap` 内の `table.mint-table` |
| 方向バッジ | `.mint-direction[data-direction="up\|down\|flat"]` |
| 入力欄 | `.mint-field` 内の `input.mint-input` / `textarea.mint-input` |
| 本文・見出し | `.mint-emphasis` / `.mint-heading`（別々のテーマ変数） |
| 補足・状態表示 | `.mint-callout` / `.mint-badge`（`data-tone` で用途を指定） |
| 記事・教材の本文 | `.mint-prose`（段落、見出し、リスト、引用、脚注） |
| 数式の表示領域 | `.mint-math`（KaTeX対応。描画ライブラリは利用アプリが導入） |
| 大きな見出し・ラベル | `.mint-display` / `.mint-section-title` / `.mint-eyebrow` |
| 幅・セクション余白 | `.mint-container` / `.mint-band` |
| 半透明・固定ヘッダー | `.mint-header[data-variant="glass"]` / `data-position="sticky\|fixed"` |
| テキストリンク・一覧 | `.mint-link` / `.mint-link-list` 内の `.mint-link-row` |
| スクロール時の登場演出 | `[data-mint-reveal]` / `initReveal(element)` |

### 伝えるページの部品（0.6.0）

ロゴスの企業サイトで育った見出し・余白・ヘッダー・リンク・登場演出を、任意に使える部品として追加しました。既存の本文、カード、ボタンの既定値は変わりません。Astroを含めフレームワークへの依存はなく、画像や会社固有の文言も含みません。

```html
<section class="mint-container mint-band">
  <p class="mint-eyebrow">OUR PURPOSE</p>
  <h1 class="mint-display" data-mint-reveal>可能性を、ひらく。</h1>
  <p>この場所にアプリの紹介文を置きます。</p>
  <a class="mint-link" href="/about/">
    私たちについて<span class="mint-link-icon" aria-hidden="true">↗</span>
  </a>
</section>
```

`.mint-display` は大きな主見出し、`.mint-section-title` は節の見出しです。見出しレベルはHTMLのh1/h2等で指定します。画面幅に合わせたサイズと自然な折り返しを使い、本文フォント・サイズを変更しません。`--mint-font-display`、`--mint-display-size`・`--mint-display-weight`・`--mint-display-leading`・`--mint-display-tracking`、`--mint-title-size`・`--mint-title-leading` を各アプリで調整できます。フォントの取得・読み込みは引き続きアプリ側です。

`.mint-container` の幅と左右の余白は `--mint-content-width`・`--mint-content-gutter`、`.mint-band` の上下余白は `--mint-band-space` で指定します。ヒーローやCTAではこれらと既存ボタンを組み合わせ、画像の位置や重ねる文字のコントラストは各アプリの実画像で確認します。

既存の `.mint-header` に `data-variant="glass"` を足すと半透明とぼかしを使います。対応しないブラウザーでは従来の不透明背景になります。`--mint-header-glass`・`--mint-header-blur` を調整でき、ダーク・ライト両方のテーマに追従します。配置は独立して `data-position="sticky"` または `"fixed"` を選び、`--mint-header-offset` と `--mint-header-layer` で調整します。固定ヘッダーの下に隠れない本文余白・アンカー位置は、アプリが実際のヘッダー高に合わせて確保してください。ナビゲーションは既存の `details.mint-disclosure[data-mint-disclosure][data-mint-dismissable]` と通常のリンクで組み立てられます。実例は部品サンプルの「Mint UI / Presentation」にあります。

一覧は次の構造を使います。行内に別のリンクやボタンを入れず、矢印は `aria-hidden="true"` にします。`time` 等の意味構造や文言、行き先はアプリ側で指定します。

```html
<ul class="mint-link-list">
  <li><a class="mint-link-row" href="/news/example/">
    <span class="mint-link-row-body">
      <time class="mint-link-row-meta" datetime="2026-09-24">2026.09.24</time>
      <span class="mint-link-row-title">お知らせのタイトル</span>
      <span class="mint-link-row-description">必要に応じた説明文。</span>
    </span>
    <span class="mint-link-icon" aria-hidden="true">↗</span>
  </a></li>
</ul>
```

#### スクロール時の登場演出

`data-mint-reveal` は `initMintUI()` が初期化します。初期表示ですでに見えている要素はそのまま表示し、画面外の要素が入ってきた時に一度だけアニメーションします。常時動く要素ではなく、見出しや一覧の行などの外枠に使います。要素に独自の `translate` 演出がある場合は、その外側のラッパーに指定します。

```js
import { initReveal } from '@yushi/mint-ui';
const reveal = initReveal(element); // 同じ要素への再初期化は同じコントローラー
reveal.show();                     // 即時表示・進行中の演出を解除
reveal.destroy();                  // 監視・イベント・演出を解除
```

`--mint-reveal-duration`（既定650ms、上限2秒）、`--mint-reveal-distance`（24px）、`--mint-reveal-delay`（0ms、上限600ms）と既存の `--mint-ease-out` を利用します。段階表示は対象ごとにdelayを指定します。JavaScript・IntersectionObserver・Web Animationsが利用できなくても本文は表示されます。キーボードでのフォーカス、対象へのページ内リンク、印刷、動きを抑える設定では演出を解除します。`destroy()` は元のインラインスタイルを変更せず、すべての要素を通常表示に戻します。動的に追加した要素は、その部分へ `initMintUI()` を呼んでください。

### ダーク・ライト・端末設定

既定はダークで、選択できるのはダーク・ライトです。端末設定には自動追従せず、以前保存された `auto` もダークへ戻します。`initTheme()` が保存・別タブとの同期を担当し、`html` の `data-mint-theme` と `data-mint-mode` を更新します。`createThemeSelect()` は許可されたモードだけを表示します。端末への追従が必要なアプリのみ `allowedModes: ['dark','light','auto']` を明示します。ダーク固定には `allowedModes: ['dark']` を指定し、選択UIを置きません。固定時は保存済みのライト設定や別タブからの設定変更も適用しません。

```js
import { initTheme, createThemeSelect } from '@yushi/mint-ui';
const theme = initTheme({ storageKey: 'my-app-theme', defaultMode: 'dark' });
const picker = createThemeSelect({
  theme, label: '表示テーマ',
  labels: { dark: 'ダーク', light: 'ライト', auto: '端末設定' }
});
header.append(picker.element);
// 動的な画面を取り除くとき：picker.controller.destroy()
// アプリ全体の終了時：theme.destroy()
```

保存先は同一オリジンのlocalStorageです。別ドメイン・別ポートのアプリ間で設定そのものは共有しません。`syncDarkClass: true` を指定すると、Tailwind等が使う `html.dark` も同期します。`mint:theme` イベントの `detail` は `{mode, theme}`。初回描画前のテーマ適用は各アプリのHTML側で行えます。

`.mint-prose` は明示した本文領域だけに適用し、記事幅やサイト固有の配置は変更しません。段落間隔と行間は `--mint-prose-paragraph-gap`・`--mint-prose-leading` で調整します。数式はKaTeXのCSSとライブラリを別途導入し、`.mint-math` に描画します。Mint UI自体にKaTeXへの依存はありません。

メニュー用途の `details.mint-disclosure` には `data-mint-dismissable` を追加できます。外側クリック・Esc・リンク選択で閉じ、Escでは見出しへフォーカスを戻します。通常の説明パネルには付けません。

### フォームとメニュー

明るいアクセント色で塗る面の文字には `--mint-on-accent` を使います。通常本文の `--mint-text` とは用途を分けます。日常操作のボタンには `data-variant="neutral"` を指定すると、ネイビー系の背景と明るい文字になります。色の組は `--mint-control-surface`・`--mint-control-hover`・`--mint-control-active`・`--mint-control-text` で共通管理し、ライトテーマにも追従します。

メニューはブラウザの最前面レイヤーに表示し、カードやスクロール領域で切れないようにします。Popover APIがない環境ではbodyへ一時的に移動します。画面端で位置・開く方向・最大高さを調整し、長いリストはスクロールできます。閉じる・破棄する際に状態とDOM位置を戻します。

動的な選択欄はHTMLを組み立てず、共通ヘルパーで作れます。ラベルはテキストとして設定します。

```js
import { createSelect } from '@yushi/mint-ui';
const { element, controller } = createSelect({
  label: '状態', value: 'draft',
  options: [{value: 'draft', label: '下書き'}, {value: 'ready', label: '準備できた'}]
});
element.dataset.width = 'full'; // 任意。小さな操作欄には data-size="sm"
container.append(element);
element.addEventListener('mint:change', event => saveStatus(event.detail.value));
// DOMを取り除く・作り直す前に実行する。
controller.destroy();
```

入力は通常のlabelとinput/textareaを使い、フォーカス・無効状態・`aria-invalid="true"` を共通CSSで扱います。フォーム送信や必須項目の検査はアプリ側で行います。カスタム選択欄はネイティブform送信へ自動登録されないため、値はcontrollerまたはイベントから取得してください。

表示モード切替のボタン群は、`role="group"` と `aria-pressed` でもタブのインジケーターを利用できます。画面の表示切替は引き続きアプリ側が担当します。

### 印刷テーマ

標準は紙向けの明るい配色です。カードの背景・文字色も合わせて切り替えます。ダークな資料など画面配色を維持する場合は、`<html data-mint-print-theme="screen">` を指定してください。印刷の背景出力はブラウザの設定にも依存します。ページサイズ・改ページ・印刷する領域はアプリ側で指定します。

見出しには `--mint-text-heading`、強調する本文には `--mint-text-emphasis` を使います。カード見出しのみ変更する場合は `--mint-card-heading-color` を設定できます。

選択メニューは通常の `<select>` を使わず、共通のボタンとリストを使います。開いたリストまで CSS で描画するため、OS やブラウザー標準の選択メニューの青色が混ざりません。フォーカス、矢印キー、Enter、Esc、外側クリックも共通部品で処理します。

```js
import { initSelect } from '@yushi/mint-ui';

const root = document.querySelector('[data-mint-select]');
const select = initSelect(root);

root.addEventListener('mint:change', event => {
  // 言語の切り替えや保存は、利用するアプリ側の仕事。
  console.log(event.detail.value);
});

select.setValue('fr'); // 表示と選択状態を同期。イベントは発火しない。
select.setValue('ja', { emit: true }); // 通知も必要な場合。
```

`initMintUI()` は対象属性が付いた部品をまとめて初期化します。個別には `initSelect`、`initTabs`、`initDisclosure` を使えます。タブのリンクと表示ページの対応付けはアプリ側で行い、選択中のリンクに `aria-current="page"` を付けます。部品はその変更を追って背景を移動します。文字幅を変える独自処理のあとには、タブのコントローラーの `refresh()` も利用できます。

## 見た目の互換性

共通化では、利用者が選んだ既存の見た目を維持します。近似色への置換や、既存画面への本文スタイルの一括適用はしません。本文部品の既定行間1.75や引用の左線は、選んで使う初期値です。アプリ固有の値を同じに揃える必要はありません。

リンク・目次の背景は `--mint-link-surface-hover` / `--mint-link-surface-active`、文字選択は `--mint-selection-surface`、区切り線は `--mint-line-divider`、引用の線は `--mint-prose-quote-line` を使います。塗りつぶしたボタンやタブの既存配色とは役割を分け、従来の色を正確に保持します。独自レイアウトを持つ教材に `.mint-prose` を追加する必要はありません。テーマ・操作・数式部品は独立して利用できます。

回帰検証の基準は `tests/mint-ui-appearance.json` です。思索日記は共通化前の公開版、学術ノートとM&Aツールはそれぞれ共通化前のテーマを基準にしています。版番号・インストール整合性や操作テストだけでは、見た目の互換性を保証できません。意図した見た目の変更がある場合だけ、変更の根拠とともに基準を更新します。

## アプリごとに調整する

- 共通変数を利用・上書きするか、アプリ専用の変数・CSSを使えます。行間・余白・幅・字体・配色・情報密度の調整にライブラリ変更は不要です。
- 必要な部品だけ採用します。既存部品で合う操作は再利用し、専用部品でもキー操作やフォーカスの品質を保ちます。
- 調整はアプリの領域に限定し、vendorを直接編集しません。公開変数で足りない箇所をアプリ固有CSSで補うことも正規の運用です。無関係なアプリへの波及や共通化を要求しません。
- 翻訳、教材、業務データ、ページ切り替え、業務データの保存はアプリ側に残す。テーマ設定の保存は `initTheme` に任せ、保存キーはアプリ側で指定する。
- 更新時はキーボード操作、モバイル表示、動きを抑える設定も確認する。

```css
/* 別プロジェクトでテーマを変える場合。共通 CSS のあとに読み込む。 */
:root {
  --mint-radius-card: 28px;
  --mint-radius-control: 17px;
  /* 色は --mint-accent / --mint-accent-surface などをまとめて変更。 */
}

/* 画面固有のレイアウトは利用側に置く。 */
.my-dashboard { max-width: 1080px; margin: auto; }
```

部品はアプリ内の UI を統一します。ブラウザー自体のメニューや、まだ共通部品がないネイティブ入力のポップアップまで置き換えるものではありません。

## リポジトリ外で版を固定して使う

静的インストーラーは同じ版・同じ内容なら何もせず、同じ版で内容が違う場合は上書きを拒否します。リポジトリ内外とも自動更新しません。アプリは好きな版を維持し、必要になった時だけ導入・検証します。

npmのローカルパス導入はソースの変更を参照することがあります。固定配布にはソースフォルダで `npm pack` を実行し、出力された `.tgz` のパスを利用先で `npm install` へ渡してください。公開npmパッケージとしては提供していません。

## AIにも同じルールを使わせる

導入先の指示には「Mint UIは任意の固定版・必要な部品だけ使う。見た目はアプリ側でも調整でき、更新・検証はそのアプリで独立して行う」と記載します。旧vendorの指示に一括更新・全アプリ検証が残っていても、現在の親リポジトリの運用を優先します。

選択肢の追加・削除後はコントローラーを `destroy()` して再初期化します。同じ要素を繰り返し初期化しても既存コントローラーを返すため、イベントが重複しません。

## 検証

ライブラリは `node scripts/mint-ui-pipeline.mjs check library`、アプリは `check study` / `check ma-template` / `check notes` で別々に検証します。各アプリの見た目の基準も個別に管理します。異なる版を使うことやアプリ固有の値はエラーではありません。

`node test/serve.mjs` で表示されるURLを開き、「Run checks」でブラウザの回帰チェックを実行できます。カード内の表示、Popoverの代替表示、選択通知、破棄後のDOM復元、文字列の安全な表示、モード切替を検証します。同じサーバーの `/examples/index.html` から部品サンプルも確認できます。矢印キー・Enter・Esc・Tab・無効な選択肢のスキップ、狭い画面での位置調整はブラウザでも確認してください。

## ページの上端に表の見出しを固定する

`<div class="mint-table-wrap" data-mint-sticky-table>` の中に `table.mint-table` と `thead` を配置し、`initMintUI()` を呼びます。個別には `initStickyTable(wrapper)` でも初期化できます。

見出しは通常の位置からスクロールし、画面上端に達すると固定され、表の末尾で退出します。表は高さ制限なしの一覧表示になります。横スクロールと列幅、翻訳・画面幅の変化にも追従します。既存の表は属性を付けるまで変わりません。

固定部分は読み上げ対象外の表示用コピーです。ソートボタン等の操作を持たない見出しに使ってください。読み上げ・印刷には元の表を使います。上端に別の固定バーがあるアプリでは `--mint-sticky-top` をその高さに設定できます。コントローラーには `refresh()` と `destroy()` があります。


### Grouped optional table columns (0.3.0)

Put `data-mint-column-toggle` on the container. Inside it, add a native button
with `data-mint-columns-toggle="details"`, `aria-expanded="false"`, and
`aria-controls` pointing to the table ID. Mark every optional header/data cell
`data-mint-column="details" hidden`. Mark full-width group headings
`data-mint-colspan`; their colspan follows visible columns.
Optional button spans `data-mint-collapsed-label` / `data-mint-expanded-label`
switch their visibility. Initialize with `initColumnToggle(container)` or
`initMintUI()`. The controller exposes `setExpanded(group, boolean)` and `destroy()`.

Sticky headings opt in through `data-mint-sticky-table` on the table wrapper
and `initStickyTable(wrapper)` (or `initMintUI()`). The viewport overlay copies
the wrapper's top corner radii, column widths and theme; `--mint-sticky-top`
sets the viewport offset. A semantic original header remains in the table.

補助的なリンクには `data-tone="neutral"` を指定できます。通常は白寄りの本文色、ホバー時は明るい文字色になり、主要なミント色のリンクと区別できます。


`data-shape="soft"` on `.mint-direction` opts into a wider rounded badge. Supply a 24×24 inline SVG with rounded stroke paths and `aria-hidden="true"`; keep the accessible direction label on the badge. Plain character badges remain supported.

Use `data-shape="round"` for a circular 40px direction badge with the same SVG styling.

### Direction designs

The gallery preserves five SVG recipes: rounded arrow (recommended default), rounded triangle, chevron, bold arrow, and circular badge. Copy the semantic `.mint-direction` markup from `examples/index.html`; labels and choosing a design belong to the app. No runtime style picker is required. Keep `role="img"` and a localized `aria-label` on the badge, with its SVG hidden from assistive technology.
### Row-spanning labels and hover

Wrap each set of rows sharing a merged label in its own `<tbody data-mint-row-group>`.
Use `<th scope="row" rowspan="2">` (or the actual group size) for the shared label.
Hovering any row in that group highlights the merged label; unrelated groups stay unchanged.
This opt-in CSS behavior needs no JavaScript initialization. Each merged label must span its entire group.
