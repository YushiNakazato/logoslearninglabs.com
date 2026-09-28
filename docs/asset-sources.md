# ローカル改稿案の素材・事実確認

確認日：2026-09-28（日本時間）。本資料は Logos Learning Labs の英語サイトのローカル改稿案に使用した素材と情報の出典を記録する。サイト公開・デプロイ・ストア変更はこの作業に含めない。

## アプリ画像

ユーザーが使用を許可した `C:/Users/yushi/Desktop/app-pipeline-praxis/` の既存素材を使用した。同リポジトリの確認時 HEAD は `33d5372347a10923ca3f23c60718639245503b06`。素材選択と英語掲載原稿の正本は `app-delivery/config/pipeline.json` の `products["flag-quiz"]`。画像は Git 管理外の成果物を含むため、HEAD だけで画像の同一性を保証せず、下記の実ファイル SHA-256 を記録する。

元画像の共通ディレクトリ：

`C:/Users/yushi/Desktop/app-pipeline-praxis/app-delivery/artifacts/flag-quiz/material-preview/`

| サイト内のコピー | 元ファイル名 | 寸法 | 内容 |
| --- | --- | --- | --- |
| `public/assets/apps/flag-quiz.png` | `source-68cea383a4d19da7dab502c6eb85a21ea27531fbafb3afe8ac23a29dda3c6e31.png` | 1170 × 2532 | 英語版の国旗クイズ。スウェーデンの国旗と回答選択肢。 |
| `public/assets/apps/flag-study.png` | `source-5a1a7163d64e275c378edb3e78424f00069db4697db30d976b5acda9af563d25.png` | 1170 × 2532 | 英語版 Study の Look-alikes。北欧の国旗一覧。 |
| `public/assets/apps/flag-country.png` | `source-f560669316704f0a57a475d0b486f45ba9521d7724b952dfe203b79e1d8529bb.png` | 1170 × 2532 | 英語版のスウェーデン解説と国別統計。 |
| `public/assets/apps/flag-icon.png` | `asset-3e8f8029c98099fbab0e3cbe0f8dc4ebf370876490a4f0e562d3898563585160.png` | 1024 × 1024 | 正本で選択済みの Flag Quiz アイコン。 |

元ファイルとコピー双方の SHA-256 を実測し、一致を確認した。

```text
public/assets/apps/flag-quiz.png
68cea383a4d19da7dab502c6eb85a21ea27531fbafb3afe8ac23a29dda3c6e31

public/assets/apps/flag-study.png
5a1a7163d64e275c378edb3e78424f00069db4697db30d976b5acda9af563d25

public/assets/apps/flag-country.png
f560669316704f0a57a475d0b486f45ba9521d7724b952dfe203b79e1d8529bb

public/assets/apps/flag-icon.png
3e8f8029c98099fbab0e3cbe0f8dc4ebf370876490a4f0e562d3898563585160
```

スクリーンショットは既存の実アプリ画面で、正本には英語・場面名・元画像ハッシュ・レビュー済みの記録がある。このサイト作業では撮影し直していない。画面内の文章、回答、国旗、数値、時刻などの画素は変更せず、そのままコピーした。サイト側の CSS による表示サイズ・傾き・枠・影はプレゼンテーションであり、アプリの追加機能や新たな実機検証を表すものではない。

## Logos 会社サイトの背景

- コピー先：`public/assets/logos-flow.webp`
- 元ファイル：`C:/Users/yushi/Desktop/singularity-natives-praxis/logos-website/public/images/logos-flow.webp`
- 元リポジトリの確認時 HEAD：`4cadeb9049774cbd81be3fc1cc04bb7dfc32acfc`
- SHA-256（元とコピーで一致）：`798c0332b3f19e653e389e573e88c4188bf192f34e5996af8fbe9cc681a3e178`

ユーザーが求めた現行 Logos 会社サイトとの意匠のつながりを作るため、その既存背景を使用した。画像自体の加工はしていない。

## 掲載内容の根拠

Flag Quiz の名称・機能・言語は `app-delivery/config/pipeline.json` の英語原稿と照合した。

- 正式掲載名：`Flag Quiz | LOGOS`。
- 英語と日本語に対応。国の選択範囲は最大 196 カ国。
- 国旗から国名、国名から国旗を答える形式。選択回答と文字入力。
- ランダム、近隣国、似た国旗、カスタムリストでの練習。
- 国旗の解説と人口・GDP・貿易などの国別情報。国旗ごとの正答率表示。
- App Store ID：`6773493254`。既存運用資料にも同じ ID の公開リンクがある。
- App Store リンク：<https://apps.apple.com/app/apple-store/id6773493254>。
- アプリのサポート：<https://logos-transnational.github.io/casual-learning-apps-legal/flag-quiz/support/>。
- アプリのプライバシーポリシー：<https://logos-transnational.github.io/casual-learning-apps-legal/flag-quiz/privacy/>。

2026-09-28 にブラウザーで [米国 App Store の公開ページ](https://apps.apple.com/us/app/flag-quiz-logos/id6773493254) を読取確認した。掲載名 `Flag Quiz | LOGOS`、販売元 `Logos Learning Labs Inc.`、バージョン `1.0.2`（更新表示 `1d ago`）、英語・日本語対応、最大 196 カ国、および上記の機能説明を確認した。`app-delivery/docs/CURRENT_STATE.md` の 2026-09-27 時点の「1.0.2 は審査待ち」という記録より、この公開ページの確認結果を優先する。先行する Web ツールの読取エラーによる未確認状態は、このブラウザー確認で解消した。確認先は米国ストアであり、全配信国での提供範囲を検証したことを意味しない。

Android の一般公開を確認した記録はない。最新の参照記録は審査中であり、この案では Google Play で提供中という表示・ダウンロード導線を追加しない。Country Map Quiz はローカル準備中で App Store ID が未設定のため、公開済みアプリとして扱わない。

## 既存会社情報の維持

元の会社サイトの `index.html`（このリポジトリの改稿前 HEAD `ee32f5d529a3c700f8da26b8c0dcbe833440e9b5`）に掲載されていた会社名・住所・公開窓口を使用する。別の資料の住所表記で上書きしない。

- Company name: Logos Learning Labs Inc.
- Address: 8171 Ackroyd Road Unit 180, Suite 1014, Richmond, BC V6X 3K1, Canada
- Support: `support@logoslearninglabs.com`
- Business contact: `contact@logoslearninglabs.com`

会社を Richmond, British Columbia, Canada のスタジオとして紹介し、ユーザーの指示どおりサイト本文・ナビゲーション・画像の説明は英語にする。既存情報の継承は、今回法人登記や住所を外部照会したことを意味しない。
