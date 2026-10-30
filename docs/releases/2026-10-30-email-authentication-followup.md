# メール認証の追加確認 — 2026-10-30

## 確認できたこと

2026-10-30（JST）、前日の[DNS設定記録](2026-10-29-email-authentication.md)と[確認JSON](2026-10-29-email-authentication-dns.json)を読み、以下を再確認した。

- `nslookup -type=TXT logoslearninglabs.com 01.dnsv.jp` および同じ問い合わせの `8.8.8.8` 宛ての結果は、どちらも SPF が **1件**、値は `v=spf1 include:_spf.google.com ~all`。Google所有確認TXTも存在する。
- `nslookup -type=TXT _dmarc.logoslearninglabs.com 01.dnsv.jp` および同じ問い合わせの `8.8.8.8` 宛ての結果は、どちらも `v=DMARC1; p=quarantine`。
- 元のDNS記録2ファイルは、子リポジトリのコミット `efb08878dcd04fa730a98f9ba64192a1ae5b9a48` に保存済み。作業ツリーはクリーンで、HEAD、ローカルの追跡参照、`git ls-remote origin refs/heads/codex/learning-labs-redesign` の応答がすべて同じSHAだった。
- 親リポジトリでは `5b58ea382ed6b9c1da7febfe88aacc7ce14cbea6` がその子コミットへのgitlink更新を記録している。確認時の親HEADと `origin/main`、`git ls-remote origin refs/heads/main` はすべて `07627ace3a462e4f11c776a9070d0b1fac768845`。そのHEADのgitlinkも `efb08878dcd04fa730a98f9ba64192a1ae5b9a48` であり、前日の記録と親側更新のpushを確認できた。

## 未完了の確認と阻害要因

- 接続済みGmailは `singularitynatives.com` のアカウントで、`in:anywhere from:support@logoslearninglabs.com` の検索結果は0件。受信側の Authentication-Results を検証できる既存メールは、この接続先では見つからなかった。
- Chromeの既存Google Adminタブは、タブ一覧上ではGoogleの再認証ページだった。内容取得は `Emulation.setFocusEmulationEnabled` の10秒タイムアウトで失敗し、再取得でも同じ結果だった。
- ブラウザ操作セッションをリセットしてGmailを開く復旧も実行タイムアウトとなった。したがって、今回の管理コンソール内部の状態、およびsupport@を実際の送信元として使えるGmailセッションは確認できていない。
- 新しいテストメールは送信していない。`spf=pass`、`dkim=pass`、`dmarc=pass`、Fromとのドメイン整合、Google AdminのDKIM署名開始状態は引き続き **未確認**。DNS公開鍵の存在だけでは署名稼働の証拠としない。

再開には、ブラウザ接続の復旧と、対象送信元を使用できるGoogleアカウント／Google Adminへのアクセスが必要。既存の受信メールで十分なヘッダー証拠が得られなければ、本人Gmail宛ての無害な認証テストを送信レビュー後に行う。

## 変更の範囲

今回はDNS、DKIM鍵、署名設定、認証・権限、メール送信元設定を変更していない。実メールのDMARC failも観測していないため、`p=none`への切戻しはしていない。

この追加記録のみを子リポジトリのソースブランチへ保存し、親はgitlinkのみを更新する。メール本文・秘密情報は記録しない。別作業の `corporate/name-change-2026-10/11_cert_reissue_20261029/` および `12_review_20261030/` は変更・ステージ対象外。
